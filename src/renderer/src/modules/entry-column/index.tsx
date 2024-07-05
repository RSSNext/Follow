import { useMainContainerElement } from "@renderer/atoms/dom"
import { useGeneralSettingKey } from "@renderer/atoms/settings/general"
import { useUser } from "@renderer/atoms/user"
import { m } from "@renderer/components/common/Motion"
import { EmptyIcon } from "@renderer/components/icons/empty"
import { ActionButton, StyledButton } from "@renderer/components/ui/button"
import { DividerVertical } from "@renderer/components/ui/divider"
import { LoadingCircle } from "@renderer/components/ui/loading"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { EllipsisHorizontalTextWithTooltip } from "@renderer/components/ui/typography"
import { useRead } from "@renderer/hooks/biz/useEntryActions"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import {
  useRouteEntryId,
  useRouteParms,
} from "@renderer/hooks/biz/useRouteParams"
import { useRefValue } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import {
  FEED_COLLECTION_LIST,
  levels,
  ROUTE_ENTRY_PENDING,
  ROUTE_FEED_IN_FOLDER,
  ROUTE_FEED_PENDING,
  views,
} from "@renderer/lib/constants"
import { getStorageNS } from "@renderer/lib/ns"
import { shortcuts } from "@renderer/lib/shortcuts"
import { cn, getEntriesParams, getOS, isBizId } from "@renderer/lib/utils"
import { EntryHeader } from "@renderer/modules/entry-content/header"
import { useEntries } from "@renderer/queries/entries"
import { useRefreshFeedMutation } from "@renderer/queries/feed"
import { entryActions } from "@renderer/store/entry"
import {
  useEntry,
  useEntryIdsByFeedIdOrView,
} from "@renderer/store/entry/hooks"
import { useFeedById, useFeedHeaderTitle } from "@renderer/store/feed"
import {
  subscriptionActions,
  useFolderFeedsByFeedId,
} from "@renderer/store/subscription"
import type { HTMLMotionProps } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { debounce } from "lodash-es"
import type { FC } from "react"
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import type { ListRange, VirtuosoHandle, VirtuosoProps } from "react-virtuoso"
import { Virtuoso, VirtuosoGrid } from "react-virtuoso"
import { useEventCallback } from "usehooks-ts"

import { EntryItem } from "./item"

const unreadOnlyAtom = atomWithStorage<boolean>(
  getStorageNS("entry-unreadonly"),
  true,
  undefined,
  {
    getOnInit: true,
  },
)

export function EntryColumn() {
  const entries = useEntriesByView()
  const { entriesIds, isFetchingNextPage } = entries
  const { entryId: activeEntryId, view, feedId } = useRouteParms()
  const activeEntry = useEntry(activeEntryId)
  const markReadMutation = useRead()
  useEffect(() => {
    if (!activeEntry || activeEntry.read) {
      return
    }
    markReadMutation.mutate(activeEntry)
  }, [activeEntry?.entries?.id, activeEntry?.read])

  const handleMarkreadInRange = useEventCallback(
    debounce(
      async ({ startIndex }: ListRange) => {
        const idSlice = entriesIds?.slice(0, startIndex)

        if (!idSlice) return

        const batchLikeIds = [] as [string, string][]
        const entriesId2Map = entryActions.getFlattenMapEntries()
        for (const id of idSlice) {
          const entry = entriesId2Map[id]

          if (!entry) continue
          const isRead = entry.read
          if (!isRead) {
            batchLikeIds.push([entry.feeds.id, id])
          }
        }

        if (batchLikeIds.length > 0) {
          const entryIds = batchLikeIds.map(([, id]) => id)
          await apiClient.reads.$post({ json: { entryIds } })

          for (const [feedId, id] of batchLikeIds) {
            entryActions.markRead(feedId, id, true)
          }
        }
      },
      1000,
      { leading: false },
    ),
  )
  const scrollMarkUnread = useGeneralSettingKey("scrollMarkUnread")
  const virtuosoOptions = {
    components: {
      List: ListContent,

      Footer: useCallback(() => {
        if (!isFetchingNextPage) return null
        return (
          <div className="center mt-2">
            <LoadingCircle size="medium" />
          </div>
        )
      }, [isFetchingNextPage]),
    },
    rangeChanged: scrollMarkUnread ? handleMarkreadInRange : undefined,
    totalCount: entries.totalCount,
    endReached: () => entries.hasNextPage && entries.fetchNextPage(),
    data: entriesIds,
    itemContent: useCallback(
      (_, entryId: string) => {
        if (!entryId) return null

        return <EntryItem key={entryId} entryId={entryId} view={view} />
      },
      [view],
    ),
  }

  const navigate = useNavigateEntry()
  return (
    <div
      className="relative flex h-full flex-1 flex-col"
      onClick={() =>
        navigate({
          entryId: null,
        })}
      data-total-count={virtuosoOptions.totalCount}
    >
      <ListHeader totalCount={virtuosoOptions.totalCount} />
      <m.div
        key={`${feedId}-${view}`}
        className="h-full"
        initial={{ opacity: 0.01, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.01, y: -100 }}
      >
        {virtuosoOptions.totalCount === 0 ? (
          <EmptyList />
        ) : view && views[view].gridMode ?
            (
              <VirtuosoGrid
                listClassName="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 px-4"
                {...virtuosoOptions}
              />
            ) :
            (
              <EntryList {...virtuosoOptions} />
            )}
      </m.div>
    </div>
  )
}

const useEntriesByView = () => {
  const routeParams = useRouteParms()
  const unreadOnly = useAtomValue(unreadOnlyAtom)

  const { level, feedId, view } = routeParams

  const folderIds = useFolderFeedsByFeedId(feedId)

  const query = useEntries({
    level,
    id: level === levels.folder ? folderIds?.join(",") : feedId,
    view,
    ...(unreadOnly === true && { read: false }),
  })
  const entries = useEntryIdsByFeedIdOrView(
    feedId === ROUTE_FEED_PENDING ? view : feedId!,
    {
      unread: unreadOnly,
      view,
    },
  )

  useHotkeys(
    shortcuts.entries.refetch.key,
    () => {
      query.refetch()
    },
    { scopes: ["home"] },
  )

  // in unread only entries only can grow the data, but not shrink
  // so we memo this previous data to avoid the flicker
  const prevEntries = useRef(entries)

  useEffect(() => {
    prevEntries.current = []
  }, [routeParams.feedId, routeParams.view])
  const localEntries = useMemo(() => {
    if (!unreadOnly) {
      prevEntries.current = []
      return entries
    }
    if (!prevEntries.current) {
      prevEntries.current = entries
      return entries
    }
    if (entries.length > prevEntries.current.length) {
      prevEntries.current = entries
      return entries
    }
    // merge the new entries with the old entries, and unique them
    const nextIds = [...new Set([...prevEntries.current, ...entries])]
    prevEntries.current = nextIds
    return nextIds
  }, [entries, prevEntries, unreadOnly])

  const remoteEntryIds = useMemo(
    () =>
      query.data ?
        query.data.pages.reduce((acc, page) => {
          if (!page.data) return acc
          acc.push(...page.data.map((entry) => entry.entries.id))
          return acc
        }, [] as string[]) :
        null,
    [query.data],
  )

  return {
    ...query,

    // If remote data is not available, we use the local data, get the local data length
    totalCount: query.data?.pages?.[0]?.total ?? localEntries.length,
    entriesIds:
      // NOTE: if we use the remote data, priority will be given to the remote data, local data maybe had sort issue
      remoteEntryIds ?? localEntries,
  }
}

const ListHeader: FC<{
  totalCount: number
}> = ({ totalCount }) => {
  const routerParams = useRouteParms()
  const [unreadOnly, setUnreadOnly] = useAtom(unreadOnlyAtom)

  const { feedId, entryId, view } = routerParams
  const folderIds = useFolderFeedsByFeedId(feedId)

  const [markPopoverOpen, setMarkPopoverOpen] = useState(false)
  const handleMarkAllAsRead = useCallback(async () => {
    if (!routerParams) return
    await apiClient.reads.all.$post({
      json: {
        ...getEntriesParams({
          level: routerParams?.level,
          id:
            routerParams.level === levels.folder ?
              folderIds?.join(",") :
              feedId,
          view: routerParams?.view,
        }),
      },
    })

    if (
      typeof routerParams.feedId === "number" ||
      routerParams.feedId === ROUTE_FEED_PENDING
    ) {
      subscriptionActions.markReadByView(routerParams.view)
    } else if (
      routerParams.level === levels.folder &&
      routerParams.feedId?.startsWith(ROUTE_FEED_IN_FOLDER)
    ) {
      subscriptionActions.markReadByFolder(
        routerParams.feedId.replace(ROUTE_FEED_IN_FOLDER, ""),
      )
    } else {
      routerParams.feedId?.split(",").forEach((feedId) => {
        entryActions.markReadByFeedId(feedId)
      })
    }
    setMarkPopoverOpen(false)
  }, [feedId, folderIds, routerParams])

  const headerTitle = useFeedHeaderTitle()
  const os = useMemo(getOS, [])

  const titleAtBottom = window.electron && os === "macOS"
  const titleInfo = (
    <div className={!titleAtBottom ? "min-w-0 translate-y-1" : void 0}>
      <div className="min-w-0 break-all text-lg font-bold leading-none">
        <EllipsisHorizontalTextWithTooltip className="inline-block !w-auto max-w-full">
          {headerTitle}
        </EllipsisHorizontalTextWithTooltip>
      </div>
      <div className="text-xs font-medium text-zinc-400">
        {totalCount || 0}
        {" "}
        {unreadOnly ? "Unread" : ""}
        {" "}
        Items
      </div>
    </div>
  )
  const { mutateAsync: refreshFeed, isPending } = useRefreshFeedMutation(
    routerParams.feedId,
  )

  const user = useUser()

  const feed = useFeedById(routerParams.feedId)

  const isInCollectionList = feedId === FEED_COLLECTION_LIST

  return (
    <div className="mb-5 flex w-full flex-col pl-11 pr-4 pt-2.5">
      <div
        className={cn(
          "flex w-full",
          titleAtBottom ? "justify-end" : "justify-between",
        )}
      >
        {!titleAtBottom && titleInfo}
        {!isInCollectionList && (
          <div
            className="relative z-[1] flex items-center gap-1 self-baseline text-zinc-500"
            onClick={(e) => e.stopPropagation()}
          >
            {views[view].wideMode &&
              entryId &&
              entryId !== ROUTE_ENTRY_PENDING && (
              <>
                <EntryHeader view={view} entryId={entryId} />
                <DividerVertical className="w-px" />
              </>
            )}
            {feed?.ownerUserId === user?.id && isBizId(routerParams.feedId) && (
              <ActionButton
                tooltip="Refresh"
                // shortcut={shortcuts.entries.toggleUnreadOnly.key}
                onClick={() => {
                  refreshFeed()
                }}
              >
                <i
                  className={cn(
                    "i-mgc-refresh-2-cute-re",
                    isPending && "animate-spin",
                  )}
                />
              </ActionButton>
            )}
            <ActionButton
              tooltip={unreadOnly ? "Unread Only" : "All"}
              shortcut={shortcuts.entries.toggleUnreadOnly.key}
              onClick={() => setUnreadOnly(!unreadOnly)}
            >
              {unreadOnly ? (
                <i className="i-mgc-round-cute-fi" />
              ) : (
                <i className="i-mgc-round-cute-re" />
              )}
            </ActionButton>
            <Popover open={markPopoverOpen} onOpenChange={setMarkPopoverOpen}>
              <PopoverTrigger asChild>
                <ActionButton
                  shortcut={shortcuts.entries.markAllAsRead.key}
                  tooltip="Mark All as Read"
                >
                  <i className="i-mgc-check-circle-cute-re" />
                </ActionButton>
              </PopoverTrigger>
              <PopoverContent className="flex w-fit flex-col items-center justify-center gap-3 text-[0.94rem] font-medium">
                <div>Mark all as read?</div>
                <div className="space-x-4">
                  <PopoverClose>
                    <StyledButton variant="outline">Cancel</StyledButton>
                  </PopoverClose>
                  {/* TODO */}
                  <StyledButton onClick={handleMarkAllAsRead}>
                    Confirm
                  </StyledButton>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      {titleAtBottom && titleInfo}
    </div>
  )
}

const ListContent = forwardRef<HTMLDivElement>((props, ref) => (
  <div className="px-2" {...props} ref={ref} />
))

const EmptyList = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  (props, ref) => {
    const unreadOnly = useAtomValue(unreadOnlyAtom)

    return (
      <m.div
        className="-mt-6 flex h-full flex-col items-center justify-center gap-2 text-zinc-400"
        {...props}
        ref={ref}
      >
        {unreadOnly ? (
          <>
            <i className="i-mgc-celebrate-cute-re -mt-11 text-3xl" />
            Zero Unread
          </>
        ) : (
          <div className="flex -translate-y-6 flex-col items-center justify-center gap-2">
            <EmptyIcon className="size-[30px]" />
            Zero Items
          </div>
        )}
      </m.div>
    )
  },
)

const EntryList: FC<VirtuosoProps<string, unknown>> = ({
  ...virtuosoOptions
}) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  const dataRef = useRefValue(virtuosoOptions.data!)
  const currentEntryIdRef = useRefValue(useRouteEntryId())

  const navigate = useNavigateEntry()

  const $mainContainer = useMainContainerElement()
  const [enabledArrowKey, setEnabledArrowKey] = useState(false)

  // Enable arrow key navigation shortcuts only when focus is on entryContent or entryList,
  // entryList shortcuts should not be triggered in the feed col
  useLayoutEffect(() => {
    if (!$mainContainer) return
    const handler = () => {
      const target = document.activeElement
      const isFocusIn =
        $mainContainer.contains(target) || $mainContainer === target

      setEnabledArrowKey(isFocusIn)
    }

    handler()
    // NOTE: focusin event will bubble to the document
    document.addEventListener("focusin", handler)
    return () => {
      document.removeEventListener("focusin", handler)
    }
  }, [$mainContainer])

  useHotkeys(
    shortcuts.entries.next.key,
    () => {
      const data = dataRef.current
      const currentActiveEntryIndex = data.indexOf(
        currentEntryIdRef.current || "",
      )

      const nextIndex = Math.min(currentActiveEntryIndex + 1, data.length - 1)

      virtuosoRef.current?.scrollIntoView({
        index: nextIndex,
      })
      const nextId = data![nextIndex]

      navigate({
        entryId: nextId,
      })
    },
    { scopes: ["home"], enabled: enabledArrowKey },
  )
  useHotkeys(
    shortcuts.entries.previous.key,
    () => {
      const data = dataRef.current
      const currentActiveEntryIndex = data.indexOf(
        currentEntryIdRef.current || "",
      )

      const nextIndex =
        currentActiveEntryIndex === -1 ?
          data.length - 1 :
          Math.max(0, currentActiveEntryIndex - 1)

      virtuosoRef.current?.scrollIntoView({
        index: nextIndex,
      })
      const nextId = data![nextIndex]

      navigate({
        entryId: nextId,
      })
    },
    { scopes: ["home"], enabled: enabledArrowKey },
  )
  // Prevent scroll list move when press up/down key, the up/down key should be taken over by the shortcut key we defined.
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
      }
    },
    [],
  )
  return (
    <Virtuoso
      onKeyDown={handleKeyDown}
      {...virtuosoOptions}
      ref={virtuosoRef}
    />
  )
}
