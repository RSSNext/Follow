import {
  setGeneralSetting,
  useGeneralSettingKey,
} from "@renderer/atoms/settings/general"
import { useWhoami } from "@renderer/atoms/user"
import { m } from "@renderer/components/common/Motion"
import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import { ActionButton } from "@renderer/components/ui/button"
import { DividerVertical } from "@renderer/components/ui/divider"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { EllipsisHorizontalTextWithTooltip } from "@renderer/components/ui/typography"
import {
  FEED_COLLECTION_LIST,
  ROUTE_ENTRY_PENDING,
  views,
} from "@renderer/constants"
import { shortcuts } from "@renderer/constants/shortcuts"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import { useIsOnline } from "@renderer/hooks/common/useIsOnline"
import { cn, getOS, isBizId } from "@renderer/lib/utils"
import { EntryHeader } from "@renderer/modules/entry-content/header"
import { useRefreshFeedMutation } from "@renderer/queries/feed"
import { entryActions, useEntry } from "@renderer/store/entry"
import { useFeedById, useFeedHeaderTitle } from "@renderer/store/feed"
import type { FC } from "react"
import { useCallback, useEffect, useRef } from "react"
import type {
  ScrollSeekConfiguration,
  VirtuosoHandle,
  VirtuosoProps,
} from "react-virtuoso"
import { VirtuosoGrid } from "react-virtuoso"

import { useEntriesByView, useEntryMarkReadHandler } from "./hooks"
import {
  EntryItem,
  EntryItemSkeleton,
  EntryItemSkeletonWithDelayShow,
} from "./item"
import { EntryEmptyList, EntryList, EntryListContent } from "./lists"
import { MarkAllButton } from "./mark-all-button"
import { girdClassNames } from "./styles"

const scrollSeekConfiguration: ScrollSeekConfiguration = {
  enter: (velocity) => Math.abs(velocity) > 1000,
  exit: (velocity) => Math.abs(velocity) < 1000,
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
  const { entriesIds, isFetchingNextPage, groupedCounts } = entries

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
      List: EntryListContent,
      Footer: useCallback(() => {
        if (!isFetchingNextPage) return null
        return <EntryItemSkeletonWithDelayShow view={view} />
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
    endReached: () => {
      if (!entries.isFetchingNextPage && entries.hasNextPage) {
        entries.fetchNextPage()
      }
    },
    data: entriesIds,
    onScroll: () => {
      if (!isInteracted.current) {
        isInteracted.current = true
      }
    },
    itemContent: useCallback(
      (_, entryId) => {
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
      className="relative flex h-full flex-1 flex-col @container"
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
          <div className="center box-content h-7 gap-2 py-3 text-xs">
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
          scrollbarClassName={cn(
            "mt-3",
            !views[view].wideMode ? "w-[5px] p-0" : "",
          )}
          mask={false}
          ref={scrollRef}
          rootClassName="h-full"
          viewportClassName="[&>div]:grow flex"
        >
          {virtuosoOptions.totalCount === 0 ? (
            entries.isLoading ?
              null :
                (
                  <EntryEmptyList />
                )
          ) : view && views[view].gridMode ?
              (
                <VirtuosoGrid
                  listClassName={girdClassNames}
                  {...virtuosoOptions}
                  ref={virtuosoRef}
                />
              ) :
              (
                <EntryList
                  {...virtuosoOptions}
                  virtuosoRef={virtuosoRef}
                  refetch={entries.refetch}
                  groupCounts={groupedCounts}
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

  const user = useWhoami()
  const isOnline = useIsOnline()

  const feed = useFeedById(routerParams.feedId)

  const titleStyleBasedView = [
    "pl-12",
    "pl-7",
    "pl-7",
    "pl-7",
    "px-5",
    "pl-12",
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
          <MarkAllButton />
        </div>
      </div>
      {titleAtBottom && titleInfo}
    </div>
  )
}
