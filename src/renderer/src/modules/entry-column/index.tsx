import {
  setGeneralSetting,
  useGeneralSettingKey,
} from "@renderer/atoms/settings/general"
import { useMe } from "@renderer/atoms/user"
import { m } from "@renderer/components/common/Motion"
import { EmptyIcon } from "@renderer/components/icons/empty"
import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import { ActionButton, StyledButton } from "@renderer/components/ui/button"
import { DividerVertical } from "@renderer/components/ui/divider"
import { LoadingCircle } from "@renderer/components/ui/loading"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { EllipsisHorizontalTextWithTooltip } from "@renderer/components/ui/typography"
import {
  FEED_COLLECTION_LIST,
  ROUTE_ENTRY_PENDING,
  ROUTE_FEED_IN_FOLDER,
  views,
} from "@renderer/constants"
import { shortcuts } from "@renderer/constants/shortcuts"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import { useIsOnline } from "@renderer/hooks/common/useIsOnline"
import { apiClient } from "@renderer/lib/api-fetch"
import { cn, getEntriesParams, getOS, isBizId } from "@renderer/lib/utils"
import { EntryHeader } from "@renderer/modules/entry-content/header"
import { useRefreshFeedMutation } from "@renderer/queries/feed"
import { entryActions, useEntry } from "@renderer/store/entry"
import { useFeedById, useFeedHeaderTitle } from "@renderer/store/feed"
import {
  subscriptionActions,
  useFolderFeedsByFeedId,
} from "@renderer/store/subscription"
import type { HTMLMotionProps } from "framer-motion"
import type { FC } from "react"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import type {
  ScrollSeekConfiguration,
  VirtuosoHandle,
  VirtuosoProps,
} from "react-virtuoso"
import { Virtuoso, VirtuosoGrid } from "react-virtuoso"

import { EntryColumnShortcutHandler } from "./EntryColumnShortcutHandler"
import { useEntriesByView, useEntryMarkReadHandler } from "./hooks"
import {
  EntryItem,
  EntryItemSkeleton,
  EntryItemSkeletonWithDelayShow,
} from "./item"

const scrollSeekConfiguration: ScrollSeekConfiguration = {
  enter: (velocity) => Math.abs(velocity) > 500,
  exit: (velocity) => Math.abs(velocity) < 500,
}
export function EntryColumn() {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const entries = useEntriesByView({
    onReset: useCallback(() => {
      virtuosoRef.current?.scrollTo({
        top: 0,
      })
    }, []),
  })
  const { entriesIds, isFetchingNextPage } = entries

  const {
    entryId: activeEntryId,
    view,
    feedId: routeFeedId,
    isPendingEntry,
    isCollection,
  } = useRouteParms()
  const activeEntry = useEntry(activeEntryId)

  useEffect(() => {
    if (!activeEntryId) return

    if (isCollection || isPendingEntry) return

    const feedId = activeEntry?.feedId
    if (!feedId) return

    entryActions.markRead(feedId, activeEntryId, true)
  }, [activeEntry?.feedId, activeEntryId, isCollection, isPendingEntry])

  const isInteracted = useRef(false)

  const handleMarkReadInRange = useEntryMarkReadHandler(entriesIds)

  const scrollRef = useRef<HTMLDivElement>(null)
  const virtuosoOptions = {
    components: {
      List: ListContent,
      Footer: useCallback(() => {
        if (!isFetchingNextPage) return null
        return <EntryItemSkeletonWithDelayShow delay={500} view={view} />
      }, [isFetchingNextPage, view]),
      ScrollSeekPlaceholder: useCallback(
        () => <EntryItemSkeleton view={view} single />,
        [view],
      ),
    },
    scrollSeekConfiguration,
    rangeChanged: (...args: any[]) => {
      handleMarkReadInRange &&
      // @ts-expect-error
      handleMarkReadInRange(...args, isInteracted.current)
    },
    customScrollParent: scrollRef.current!,

    totalCount: entries.totalCount,
    endReached: () => entries.hasNextPage && entries.fetchNextPage(),
    data: entriesIds,
    onScroll: () => {
      if (!isInteracted.current) {
        isInteracted.current = true
      }
    },
    itemContent: useCallback(
      (_, entryId: string) => {
        if (!entryId) return null

        return <EntryItem key={entryId} entryId={entryId} view={view} />
      },
      [view],
    ),
  } satisfies VirtuosoProps<string, unknown>

  const navigate = useNavigateEntry()
  const isRefreshing = entries.isFetching && !entries.isFetchingNextPage
  return (
    <div
      className="relative flex h-full flex-1 flex-col"
      onClick={() =>
        navigate({
          entryId: null,
        })}
      data-total-count={virtuosoOptions.totalCount}
    >
      <ListHeader
        refetch={entries.refetch}
        isRefreshing={isRefreshing}
        totalCount={virtuosoOptions.totalCount}
        hasUpdate={entries.hasUpdate}
      />
      <AutoResizeHeight spring>
        {isRefreshing && (
          <div className="center h-7 gap-2 text-xs">
            <LoadingCircle size="small" />
            Refreshing new entries...
          </div>
        )}
      </AutoResizeHeight>
      <m.div
        key={`${routeFeedId}-${view}`}
        className="relative h-0 grow"
        initial={{ opacity: 0.01, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.01, y: -100 }}
      >
        <ScrollArea.ScrollArea
          scrollbarClassName="mt-3"
          mask={false}
          ref={scrollRef}
          flex
          rootClassName="h-full"
          viewportClassName="[&>div]:grow flex pt-3 @container"
        >
          {virtuosoOptions.totalCount === 0 ? (
            entries.isLoading ?
              null :
                (
                  <EmptyList />
                )
          ) : view && views[view].gridMode ?
              (
                <VirtuosoGrid
                  listClassName={tw`grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 @7xl:grid-cols-5 px-4 gap-1.5`}
                  {...virtuosoOptions}
                  ref={virtuosoRef}
                />
              ) :
              (
                <EntryList
                  {...virtuosoOptions}
                  virtuosoRef={virtuosoRef}
                  refetch={entries.refetch}
                />
              )}
        </ScrollArea.ScrollArea>
      </m.div>
    </div>
  )
}

const ListHeader: FC<{
  totalCount: number
  refetch: () => void
  isRefreshing: boolean
  hasUpdate: boolean
}> = ({ totalCount, refetch, isRefreshing, hasUpdate }) => {
  const routerParams = useRouteParms()

  const unreadOnly = useGeneralSettingKey("unreadOnly")

  const { feedId, entryId, view } = routerParams
  const folderIds = useFolderFeedsByFeedId(feedId)

  const [markPopoverOpen, setMarkPopoverOpen] = useState(false)
  const handleMarkAllAsRead = useCallback(async () => {
    if (!routerParams) return
    await apiClient.reads.all.$post({
      json: {
        ...getEntriesParams({
          id: folderIds?.join(",") || feedId,
          view: routerParams?.view,
        }),
      },
    })

    if (typeof routerParams.feedId === "number" || routerParams.isAllFeeds) {
      subscriptionActions.markReadByView(routerParams.view)
    } else if (routerParams.feedId?.startsWith(ROUTE_FEED_IN_FOLDER)) {
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
  const os = getOS()

  const titleAtBottom = window.electron && os === "macOS"
  const isInCollectionList = feedId === FEED_COLLECTION_LIST

  const titleInfo = !!headerTitle && (
    <div className={!titleAtBottom ? "min-w-0 translate-y-1" : void 0}>
      <div className="min-w-0 break-all text-lg font-bold leading-none">
        <EllipsisHorizontalTextWithTooltip className="inline-block !w-auto max-w-full">
          {headerTitle}
        </EllipsisHorizontalTextWithTooltip>
      </div>
      <div className="text-xs font-medium text-zinc-400">
        {totalCount || 0}
        {" "}
        {unreadOnly && !isInCollectionList ? "Unread" : ""}
        {" "}
        Items
      </div>
    </div>
  )
  const { mutateAsync: refreshFeed, isPending } = useRefreshFeedMutation(
    routerParams.feedId,
  )

  const user = useMe()
  const isOnline = useIsOnline()

  const feed = useFeedById(routerParams.feedId)

  const titleStyleBasedView = [
    "pl-11",
    "pl-4",
    "pl-7",
    "pl-7",
    "px-5",
    "pl-11",
  ]

  return (
    <div
      className={cn(
        "mb-2 flex w-full flex-col pr-4 pt-2.5",
        titleStyleBasedView[view],
      )}
    >
      <div
        className={cn(
          "flex w-full",
          titleAtBottom ? "justify-end" : "justify-between",
        )}
      >
        {!titleAtBottom && titleInfo}

        <div
          className={cn(
            "relative z-[1] flex items-center gap-1 self-baseline text-zinc-500",
            (isInCollectionList || !headerTitle) &&
            "pointer-events-none opacity-0",

            "translate-x-[6px]",
          )}
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
          {isOnline ? (
            feed?.ownerUserId === user?.id && isBizId(routerParams.feedId) ?
                (
                  <ActionButton
                    tooltip="Refresh"
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
                ) :
                (
                  <ActionButton
                    tooltip={hasUpdate ? "New entries available" : "Refetch"}
                    onClick={() => {
                      refetch()
                    }}
                  >
                    <i
                      className={cn(
                        "i-mgc-refresh-2-cute-re",
                        isRefreshing && "animate-spin",
                        hasUpdate && "text-theme-accent",
                      )}
                    />
                  </ActionButton>
                )
          ) : null}
          <ActionButton
            tooltip={unreadOnly ? "Unread Only" : "All"}
            shortcut={shortcuts.entries.toggleUnreadOnly.key}
            onClick={() => setGeneralSetting("unreadOnly", !unreadOnly)}
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
    const unreadOnly = useGeneralSettingKey("unreadOnly")
    return (
      <m.div
        className="-mt-6 flex h-full grow flex-col items-center justify-center gap-2 text-zinc-400"
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

const EntryList: FC<
  VirtuosoProps<string, unknown> & {
    virtuosoRef: React.RefObject<VirtuosoHandle>

    refetch: () => void
  }
> = ({ virtuosoRef, refetch, ...virtuosoOptions }) => {
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
    <>
      <Virtuoso
        onKeyDown={handleKeyDown}
        {...virtuosoOptions}
        ref={virtuosoRef}
      />
      <EntryColumnShortcutHandler
        refetch={refetch}
        data={virtuosoOptions.data!}
        virtuosoRef={virtuosoRef}
      />
    </>
  )
}
