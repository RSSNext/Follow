import { useMainContainerElement } from "@renderer/atoms"
import { ActionButton, Button } from "@renderer/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { useRefValue } from "@renderer/hooks"
import { apiClient } from "@renderer/lib/api-fetch"
import { views } from "@renderer/lib/constants"
import { buildStorageNS } from "@renderer/lib/ns"
import { getEntriesParams } from "@renderer/lib/utils"
import { useEntries } from "@renderer/queries/entries"
import {
  feedActions,
  getCurrentEntryId,
  subscriptionActions,
  useFeedStore,
} from "@renderer/store"
import { entryActions } from "@renderer/store/entry/entry"
import { useEntryIdsByFeedIdOrView } from "@renderer/store/entry/hooks"
import type { HTMLMotionProps } from "framer-motion"
import { m } from "framer-motion"
import hotkeys from "hotkeys-js"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { debounce } from "lodash-es"
import type { FC } from "react"
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ListRange, VirtuosoHandle, VirtuosoProps } from "react-virtuoso"
import { Virtuoso, VirtuosoGrid } from "react-virtuoso"
import { useEventCallback } from "usehooks-ts"
import { useShallow } from "zustand/react/shallow"

import { EmptyIcon } from "../../components/icons/empty"
import { LoadingCircle } from "../../components/ui/loading"
import { EntryItem } from "./item"

const unreadOnlyAtom = atomWithStorage<boolean>(
  buildStorageNS("entry-unreadonly"),
  true,
  undefined,
  {
    getOnInit: true,
  },
)

export function EntryColumn() {
  const activeList = useFeedStore((state) => state.activeList)
  const entries = useEntriesByView()
  const { entriesIds, isFetchingNextPage } = entries

  const handleRangeChange = useEventCallback(
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
    overscan: window.innerHeight,
    rangeChanged: handleRangeChange,
    totalCount: entries.totalCount,
    endReached: () => entries.hasNextPage && entries.fetchNextPage(),
    data: entriesIds,
    itemContent: useCallback(
      (_, entryId: string) => {
        if (!entryId) return null

        return (
          <EntryItem key={entryId} entryId={entryId} view={activeList?.view} />
        )
      },
      [activeList?.view],
    ),
  }

  return (
    <div
      className="relative flex h-full flex-1 flex-col"
      onClick={() => feedActions.setActiveEntry(null)}
      data-total-count={virtuosoOptions.totalCount}
    >
      <ListHeader totalCount={virtuosoOptions.totalCount} />
      <m.div
        key={`${activeList?.id}-${activeList?.view}`}
        className="h-full"
        initial={{ opacity: 0.01, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.01, y: -100 }}
      >
        {virtuosoOptions.totalCount === 0 ? (
          <EmptyList />
        ) : activeList?.view && views[activeList.view].gridMode ?
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
  const activeList = useFeedStore(useShallow((state) => state.activeList))
  const unreadOnly = useAtomValue(unreadOnlyAtom)

  const query = useEntries({
    level: activeList?.level,
    id: activeList.id,
    view: activeList?.view,
    ...(unreadOnly === true && { read: false }),
  })
  const entries = useEntryIdsByFeedIdOrView(activeList.id, {
    unread: unreadOnly,
  })

  // in unread only entries only can grow the data, but not shrink
  // so we memo this previous data to avoid the flicker
  const prevEntries = useRef(entries)

  useEffect(() => {
    prevEntries.current = []
  }, [activeList.id])
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
      // FIXME we can't filter collections in local mode, so we need to use the remote data
      // activeList.id === FEED_COLLECTION_LIST ? remoteEntryIds : nextEntries,
      // NOTE: if we use the remote data, priority will be given to the remote data, local data maybe had sort issue
      remoteEntryIds ?? localEntries,
  }
}

const ListHeader: FC<{
  totalCount: number
}> = ({ totalCount }) => {
  const activeList = useFeedStore(useShallow((state) => state.activeList))
  const [unreadOnly, setUnreadOnly] = useAtom(unreadOnlyAtom)

  const [markPopoverOpen, setMarkPopoverOpen] = useState(false)
  const handleMarkAllAsRead = useCallback(async () => {
    if (!activeList) return
    await apiClient.reads.all.$post({
      json: {
        ...getEntriesParams({
          level: activeList?.level,
          id: activeList?.id,
          view: activeList?.view,
        }),
      },
    })

    if (typeof activeList.id === "number") {
      subscriptionActions.markReadByView(activeList.view)
    } else {
      activeList.id.split(",").forEach((feedId) => {
        entryActions.markReadByFeedId(feedId)
      })
    }
    setMarkPopoverOpen(false)
  }, [activeList])

  return (
    <div className="mb-5 flex w-full flex-col pl-11 pr-4 pt-2.5">
      <div className="flex w-full justify-end">
        <div className="relative z-[1] flex items-center gap-1 text-zinc-500">
          <ActionButton
            tooltip={unreadOnly ? "Unread Only" : "All"}
            onClick={() => setUnreadOnly(!unreadOnly)}
          >
            {unreadOnly ? (
              <i className="i-mingcute-round-fill" />
            ) : (
              <i className="i-mingcute-round-line" />
            )}
          </ActionButton>
          <Popover open={markPopoverOpen} onOpenChange={setMarkPopoverOpen}>
            <PopoverTrigger>
              <ActionButton onClick={() => {}} tooltip="Mark All as Read">
                <i className="i-mingcute-check-circle-line" />
              </ActionButton>
            </PopoverTrigger>
            <PopoverContent className="flex w-fit flex-col items-center justify-center gap-3 text-[15px] font-medium">
              <div>Mark all as read?</div>
              <div className="space-x-4">
                <PopoverClose>
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                </PopoverClose>
                {/* TODO */}
                <Button size="sm" onClick={handleMarkAllAsRead}>
                  Confirm
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <div className="text-lg font-bold leading-none">{activeList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {totalCount || 0}
          {" "}
          {unreadOnly ? "Unread" : ""}
          {" "}
          Items
        </div>
      </div>
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
        className="-mt-20 flex h-full flex-col items-center justify-center gap-2 text-zinc-400"
        {...props}
        ref={ref}
      >
        {unreadOnly ? (
          <>
            <i className="i-mingcute-celebrate-line -mt-11 text-3xl" />
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
  const $mainContainer = useMainContainerElement()
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  const dataRef = useRefValue(virtuosoOptions.data!)

  useEffect(() => {
    if (!virtuosoRef.current) return
    if (!$mainContainer) return
    const virtuoso = virtuosoRef.current
    const scope = "entry-list"
    const registerKeys = "up,down,j,k"
    const focusHandler = () => {
      const target = document.activeElement

      const isFocusIn =
        $mainContainer.contains(target) || $mainContainer === target

      if (isFocusIn) {
        const currentScope = hotkeys.getScope()

        if (currentScope === scope) {
          return
        }
        hotkeys(registerKeys, scope, (handler) => {
          const data = dataRef.current
          const currentActiveEntryIndex = data.indexOf(
            getCurrentEntryId() || "",
          )

          switch (handler.key) {
            case "ArrowDown":
            case "ArrowUp": {
              const nextIndex =
                // NOTE: if the current active entry is not in the list, we should set the active entry to the last one
                handler.key === "ArrowUp" && currentActiveEntryIndex === -1 ?
                  data.length - 1 :
                  Math.min(
                    Math.max(
                      0,
                      currentActiveEntryIndex +
                      (handler.key === "ArrowDown" ? 1 : -1),
                    ),
                    data.length - 1,
                  )

              virtuoso.scrollIntoView({
                index: nextIndex,
              })
              const nextId = data![nextIndex]
              feedActions.setActiveEntry(nextId)
            }
          }
        })
        hotkeys.setScope(scope)
      } else {
        hotkeys.unbind(registerKeys, scope)
        hotkeys.deleteScope(scope)
        hotkeys.setScope("all")
      }
    }
    // NOTE: focusin event will bubble to the document
    document.addEventListener("focusin", focusHandler)

    focusHandler()

    return () => {
      hotkeys.unbind(registerKeys, scope)
      hotkeys.deleteScope(scope)

      document.removeEventListener("focusin", focusHandler)
    }
  }, [$mainContainer])

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
