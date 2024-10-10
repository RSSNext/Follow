import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type {
  ScrollSeekConfiguration,
  VirtuosoGridProps,
  VirtuosoHandle,
  VirtuosoProps,
} from "react-virtuoso"
import { VirtuosoGrid } from "react-virtuoso"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { setUISetting, useUISettingKey } from "~/atoms/settings/ui"
import { m } from "~/components/common/Motion"
import { FeedFoundCanBeFollowError } from "~/components/errors/FeedFoundCanBeFollowErrorFallback"
import { FeedNotFound } from "~/components/errors/FeedNotFound"
import { AutoResizeHeight } from "~/components/ui/auto-resize-height"
import { Button } from "~/components/ui/button"
import { LoadingCircle } from "~/components/ui/loading"
import { ReactVirtuosoItemPlaceholder } from "~/components/ui/placeholder"
import { ScrollArea } from "~/components/ui/scroll-area"
import { FEED_COLLECTION_LIST, ROUTE_FEED_PENDING, views } from "~/constants"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParams, useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useTitle, useTypeScriptHappyCallback } from "~/hooks/common"
import { FeedViewType } from "~/lib/enum"
import { cn, isBizId } from "~/lib/utils"
import type { FeedModel } from "~/models"
import { useFeed } from "~/queries/feed"
import { entryActions, getEntry, useEntry } from "~/store/entry"
import { useFeedById, useFeedHeaderTitle } from "~/store/feed"
import { useSubscriptionByFeedId } from "~/store/subscription"

import { useEntriesByView, useEntryMarkReadHandler } from "./hooks"
import { EntryItem, EntryItemSkeleton } from "./item"
import { PictureMasonry } from "./Items/picture-masonry"
import { EntryListHeader } from "./layouts/EntryListHeader"
import { EntryEmptyList, EntryList, EntryListContent } from "./lists"
import { girdClassNames } from "./styles"

const scrollSeekConfiguration: ScrollSeekConfiguration = {
  enter: (velocity) => Math.abs(velocity) > 1000,
  exit: (velocity) => Math.abs(velocity) < 1000,
}
function EntryColumnImpl() {
  const { t } = useTranslation()
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [isArchived, setIsArchived] = useState(false)
  const unreadOnly = useGeneralSettingKey("unreadOnly")
  const entries = useEntriesByView({
    onReset: useCallback(() => {
      virtuosoRef.current?.scrollTo({
        top: 0,
      })
      setIsArchived(false)
    }, []),
    isArchived,
  })
  const { entriesIds, isFetchingNextPage, groupedCounts } = entries

  const {
    entryId: activeEntryId,
    view,
    feedId: routeFeedId,
    isPendingEntry,
    isCollection,
  } = useRouteParams()
  const activeEntry = useEntry(activeEntryId)
  const feed = useFeedById(routeFeedId)
  const title = useFeedHeaderTitle()
  useTitle(title)

  useEffect(() => {
    if (!activeEntryId) return

    if (isCollection || isPendingEntry) return

    const feedId = activeEntry?.feedId
    if (!feedId) return

    entryActions.markRead({ feedId, entryId: activeEntryId, read: true })
  }, [activeEntry?.feedId, activeEntryId, isCollection, isPendingEntry])

  const isInteracted = useRef(false)

  const handleMarkReadInRange = useEntryMarkReadHandler(entriesIds)

  useEffect(() => {
    if (isArchived) {
      if (entries.hasNextPage) {
        entries.fetchNextPage()
      } else {
        entries.refetch()
      }
    }
  }, [isArchived])

  const showArchivedButton =
    !isArchived &&
    !unreadOnly &&
    !isCollection &&
    routeFeedId !== ROUTE_FEED_PENDING &&
    entries.totalCount < 40 &&
    feed?.type === "feed"

  const scrollRef = useRef<HTMLDivElement>(null)
  const virtuosoOptions = {
    components: {
      List: EntryListContent,
      Footer: useCallback(() => {
        if (!isFetchingNextPage) {
          if (showArchivedButton) {
            return (
              <div className="flex justify-center py-4">
                <Button variant="outline" onClick={() => setIsArchived(true)}>
                  {t("words.load_archived_entries")}
                </Button>
              </div>
            )
          } else {
            return null
          }
        } else {
          return (
            <EntryItemSkeleton
              view={view}
              count={Math.min(
                entries.data?.pages?.[0].data?.length || 20,
                entries.data?.pages.at(-1)?.remaining || 20,
              )}
            />
          )
        }
      }, [isFetchingNextPage, view, unreadOnly, isArchived, entries]),
      ScrollSeekPlaceholder: useCallback(() => <EntryItemSkeleton view={view} count={1} />, [view]),
    },
    scrollSeekConfiguration,
    rangeChanged: (...args: any[]) => {
      handleMarkReadInRange &&
        // @ts-expect-error
        handleMarkReadInRange(...args, isInteracted.current)
    },
    customScrollParent: scrollRef.current!,

    totalCount: entries.totalCount,
    endReached: useCallback(async () => {
      if (!entries.isFetchingNextPage) {
        const remaining = entries.data?.pages.at(-1)?.remaining
        if (entries.hasNextPage && remaining) {
          await entries.fetchNextPage()
        }
      }
    }, [entries]),
    data: entriesIds,
    onScroll: () => {
      if (!isInteracted.current) {
        isInteracted.current = true
      }
    },
    itemContent: useTypeScriptHappyCallback(
      (_, entryId) => {
        if (!entryId) return <ReactVirtuosoItemPlaceholder />

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
        })
      }
      data-total-count={virtuosoOptions.totalCount}
    >
      {virtuosoOptions.totalCount === 0 &&
        !entries.isLoading &&
        !entries.error &&
        feed?.type === "feed" && <AddFeedHelper />}

      <EntryListHeader
        refetch={entries.refetch}
        isRefreshing={isRefreshing}
        totalCount={virtuosoOptions.totalCount}
        hasUpdate={entries.hasUpdate}
      />
      <AutoResizeHeight spring>
        {isRefreshing && (
          <div className="center box-content h-7 gap-2 py-3 text-xs">
            <LoadingCircle size="small" />
            {t("entry_column.refreshing")}
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
          scrollbarClassName={cn("mt-3", !views[view].wideMode ? "w-[5px] p-0" : "")}
          mask={false}
          ref={scrollRef}
          rootClassName="h-full"
          viewportClassName="[&>div]:grow flex"
        >
          {virtuosoOptions.totalCount === 0 && !showArchivedButton ? (
            entries.isLoading ? null : (
              <EntryEmptyList />
            )
          ) : view && views[view].gridMode ? (
            <ListGird
              virtuosoOptions={virtuosoOptions}
              virtuosoRef={virtuosoRef}
              hasNextPage={entries.hasNextPage}
            />
          ) : (
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

const ListGird = ({
  virtuosoOptions,
  virtuosoRef,
  hasNextPage,
}: {
  virtuosoOptions: Omit<VirtuosoGridProps<string, unknown>, "data" | "endReached"> & {
    data: string[]
    endReached: () => Promise<any>
  }
  virtuosoRef: React.RefObject<VirtuosoHandle>
  hasNextPage: boolean
}) => {
  const masonry = useUISettingKey("pictureViewMasonry")
  const view = useRouteParamsSelector((s) => s.view)
  const feedId = useRouteParamsSelector((s) => s.feedId)
  const filterNoImage = useUISettingKey("pictureViewFilterNoImage")
  const nextData = useMemo(() => {
    if (filterNoImage) {
      return virtuosoOptions.data.filter((entryId) => {
        const entry = getEntry(entryId)
        return entry?.entries.media?.length && entry.entries.media.length > 0
      })
    }
    return virtuosoOptions.data
  }, [virtuosoOptions.data, filterNoImage])
  const { t } = useTranslation()
  if (nextData.length === 0 && virtuosoOptions.data.length > 0) {
    return (
      <div className="center absolute inset-x-0 inset-y-12 -translate-y-12 flex-col gap-5">
        <i className="i-mgc-photo-album-cute-fi size-12" />
        <div className="text-sm text-muted-foreground">
          {t("entry_column.filtered_content_tip")}
        </div>

        <Button
          onClick={() => {
            setUISetting("pictureViewFilterNoImage", false)
          }}
        >
          Show All
        </Button>
      </div>
    )
  }

  const hasFilteredContent = nextData.length < virtuosoOptions.data.length

  const FilteredContentTip = hasFilteredContent && !hasNextPage && (
    <div className="center mb-6 flex flex-col gap-5">
      <i className="i-mgc-photo-album-cute-fi size-12" />
      <div>{t("entry_column.filtered_content_tip_2")}</div>

      <Button
        onClick={() => {
          setUISetting("pictureViewFilterNoImage", false)
        }}
      >
        Show All
      </Button>
    </div>
  )

  if (masonry && view === FeedViewType.Pictures) {
    return (
      <>
        <PictureMasonry
          key={feedId}
          hasNextPage={virtuosoOptions.totalCount! > virtuosoOptions.data.length}
          endReached={virtuosoOptions.endReached}
          data={nextData}
        />

        {FilteredContentTip}
      </>
    )
  }
  return (
    <>
      <VirtuosoGrid
        listClassName={girdClassNames}
        {...virtuosoOptions}
        data={nextData}
        ref={virtuosoRef}
      />
      {FilteredContentTip}
    </>
  )
}

const AddFeedHelper = () => {
  const feedId = useRouteParamsSelector((s) => s.feedId)
  const feedQuery = useFeed({ id: feedId })

  const hasSubscription = useSubscriptionByFeedId(feedId || "")

  if (hasSubscription) {
    return null
  }

  if (!feedId) {
    return
  }
  if (feedId === FEED_COLLECTION_LIST || feedId === ROUTE_FEED_PENDING) {
    return null
  }
  if (!isBizId(feedId)) {
    return null
  }

  if (feedQuery.error && feedQuery.error.statusCode === 404) {
    throw new FeedNotFound()
  }

  if (!feedQuery.data) {
    return null
  }

  throw new FeedFoundCanBeFollowError(feedQuery.data.feed as FeedModel)
}

export const EntryColumn = memo(EntryColumnImpl)
