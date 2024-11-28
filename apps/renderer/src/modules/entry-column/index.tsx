import { useMobile } from "@follow/components/hooks/useMobile.js"
import { Button } from "@follow/components/ui/button/index.js"
import { views } from "@follow/constants"
import { useTitle } from "@follow/hooks"
import type { FeedModel } from "@follow/models/types"
import { isBizId } from "@follow/utils/utils"
import type { Range } from "@tanstack/react-virtual"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { VirtuosoHandle } from "react-virtuoso"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { FeedFoundCanBeFollowError } from "~/components/errors/FeedFoundCanBeFollowErrorFallback"
import { FeedNotFound } from "~/components/errors/FeedNotFound"
import { FEED_COLLECTION_LIST, ROUTE_FEED_PENDING } from "~/constants"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParams, useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useFeed } from "~/queries/feed"
import { entryActions, useEntry } from "~/store/entry"
import { useFeedById, useFeedHeaderTitle } from "~/store/feed"
import { useSubscriptionByFeedId } from "~/store/subscription"

import { useEntriesByView, useEntryMarkReadHandler } from "./hooks"
import { useSnapEntryIdList } from "./hooks/useEntryIdListSnap"
import { EntryListHeader } from "./layouts/EntryListHeader"
import { EntryEmptyList, EntryList } from "./lists"
import { EntryColumnWrapper } from "./wrapper"

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
    }, []),
    isArchived,
  })

  const { entriesIds, isFetchingNextPage, groupedCounts } = entries
  useSnapEntryIdList(entriesIds)

  const {
    entryId: activeEntryId,
    view,
    feedId: routeFeedId,
    isPendingEntry,
    isCollection,
    inboxId,
    listId,
  } = useRouteParams()

  useEffect(() => {
    setIsArchived(false)
  }, [view, routeFeedId])

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

  // Common conditions for both showArchivedButton and shouldLoadArchivedEntries
  const commonConditions =
    !isArchived && !unreadOnly && !isCollection && routeFeedId !== ROUTE_FEED_PENDING

  // Determine if the archived button should be shown
  const showArchivedButton = commonConditions && feed?.type === "feed"
  const hasNoEntries = entries.data?.pages?.[0].data?.length === 0 && !entries.isLoading

  // Determine if archived entries should be loaded
  const shouldLoadArchivedEntries =
    commonConditions && (feed?.type === "feed" || !feed) && !inboxId && !listId && hasNoEntries

  // automatically fetch archived entries when there is no entries in timeline
  useEffect(() => {
    if (shouldLoadArchivedEntries) {
      setIsArchived(true)
    }
  }, [shouldLoadArchivedEntries])

  const handleScroll = useCallback(() => {
    if (!isInteracted.current) {
      isInteracted.current = true
    }

    if (!routeFeedId) return
  }, [routeFeedId])

  // const virtuosoOptions = {
  //   components: {
  //     List: EntryListContent,
  //     Footer: useCallback(
  //       ({ context }: VirtuosoComponentPropsContext) => {
  //         if (!isFetchingNextPage) {
  //           if (showArchivedButton) {
  //             return (
  //               <div className="flex justify-center py-4">
  //                 <Button variant="outline" onClick={() => setIsArchived(true)}>
  //                   {t("words.load_archived_entries")}
  //                 </Button>
  //               </div>
  //             )
  //           } else {
  //             return null
  //           }
  //         } else {
  //           if (context?.onlyShowArchivedButton) return null
  //           return (
  //             <EntryItemSkeleton view={view} count={entries.data?.pages?.[0].data?.length || 20} />
  //           )
  //         }
  //       },
  //       [isFetchingNextPage, showArchivedButton, t, view, entries.data?.pages],
  //     ),
  //     ScrollSeekPlaceholder: useCallback(() => <EntryItemSkeleton view={view} count={1} />, [view]),
  //   },
  //   scrollSeekConfiguration,
  //   rangeChanged: (...args: any[]) => {
  //     handleMarkReadInRange &&
  //       // @ts-expect-error
  //       handleMarkReadInRange(...args, isInteracted.current)
  //   },
  //   customScrollParent: scrollRef.current!,
  //   // initialScrollTop: prevScrollTopMap[routeFeedId || ""] || 0,

  //   endReached: useCallback(async () => {
  //     if (!entries.isFetchingNextPage && entries.hasNextPage) {
  //       await entries.fetchNextPage()
  //     }
  //   }, [entries]),
  //   data: entriesIds,
  //   onScroll: handleScroll,
  //   itemContent: useTypeScriptHappyCallback(
  //     (_, entryId) => {
  //       if (!entryId) return <ReactVirtuosoItemPlaceholder />

  //       return <EntryItem key={entryId} entryId={entryId} view={view} />
  //     },
  //     [view],
  //   ),
  // } satisfies VirtuosoProps<string, VirtuosoComponentProps>

  const navigate = useNavigateEntry()
  const isRefreshing = entries.isFetching && !entries.isFetchingNextPage
  const handleRangeChange = useCallback(
    (e: Range) => {
      handleMarkReadInRange?.(e, isInteracted.current)
    },
    [handleMarkReadInRange],
  )

  const fetchNextPage = useCallback(() => {
    if (entries.hasNextPage && !entries.isFetchingNextPage) {
      entries.fetchNextPage()
    }
  }, [entries])
  const isMobile = useMobile()
  return (
    <div
      data-hide-in-print
      className="relative flex h-full flex-1 flex-col @container"
      onClick={
        isMobile
          ? undefined
          : () =>
              navigate({
                entryId: null,
              })
      }
    >
      {entriesIds.length === 0 && !entries.isLoading && !entries.error && feed?.type === "feed" && (
        <AddFeedHelper />
      )}

      <EntryListHeader
        refetch={entries.refetch}
        isRefreshing={isRefreshing}
        hasUpdate={entries.hasUpdate}
      />

      <EntryColumnWrapper
        onScroll={handleScroll}
        onPullToRefresh={entries.refetch}
        key={`${routeFeedId}-${view}`}
      >
        {entriesIds.length === 0 && !showArchivedButton ? (
          entries.isLoading ? null : (
            <EntryEmptyList />
          )
        ) : view && views[view].gridMode ? null : (
          <EntryList
            onRangeChange={handleRangeChange}
            hasNextPage={entries.hasNextPage}
            view={view}
            feedId={routeFeedId || ""}
            entriesIds={entriesIds}
            fetchNextPage={fetchNextPage}
            refetch={entries.refetch}
            groupCounts={groupedCounts}
            Footer={
              !isFetchingNextPage && showArchivedButton ? (
                <div className="flex justify-center py-4">
                  <Button variant="outline" onClick={() => setIsArchived(true)}>
                    {t("words.load_archived_entries")}
                  </Button>
                </div>
              ) : null
            }
          />
        )}
      </EntryColumnWrapper>
    </div>
  )
}

// const ListGird = ({
//   virtuosoOptions,
//   virtuosoRef,
//   hasNextPage,
// }: {
//   virtuosoOptions: Omit<
//     VirtuosoGridProps<string, VirtuosoComponentProps>,
//     "data" | "endReached"
//   > & {
//     data: string[]
//     endReached: () => Promise<any>
//   }
//   virtuosoRef: React.RefObject<VirtuosoHandle>
//   hasNextPage: boolean
// }) => {
//   const isMobile = useMobile()
//   const masonry = useUISettingKey("pictureViewMasonry") || isMobile
//   const view = useRouteParamsSelector((s) => s.view)
//   const feedId = useRouteParamsSelector((s) => s.feedId)
//   const filterNoImage = useUISettingKey("pictureViewFilterNoImage")
//   const nextData = useMemo(() => {
//     if (filterNoImage) {
//       return virtuosoOptions.data.filter((entryId) => {
//         const entry = getEntry(entryId)
//         return entry?.entries.media?.length && entry.entries.media.length > 0
//       })
//     }
//     return virtuosoOptions.data
//   }, [virtuosoOptions.data, filterNoImage])
//   const { t } = useTranslation()
//   if (nextData.length === 0 && virtuosoOptions.data.length > 0) {
//     return (
//       <div className="center absolute inset-x-0 inset-y-12 -translate-y-12 flex-col gap-5">
//         <i className="i-mgc-photo-album-cute-fi size-12" />
//         <div className="text-sm text-muted-foreground">
//           {t("entry_column.filtered_content_tip")}
//         </div>

//         <Button
//           onClick={() => {
//             setUISetting("pictureViewFilterNoImage", false)
//           }}
//         >
//           Show All
//         </Button>
//       </div>
//     )
//   }

//   const hasFilteredContent = nextData.length < virtuosoOptions.data.length

//   const FilteredContentTip = hasFilteredContent && !hasNextPage && (
//     <div className="center mb-6 flex flex-col gap-5">
//       <i className="i-mgc-photo-album-cute-fi size-12" />
//       <div>{t("entry_column.filtered_content_tip_2")}</div>

//       <Button
//         onClick={() => {
//           setUISetting("pictureViewFilterNoImage", false)
//         }}
//       >
//         Show All
//       </Button>
//     </div>
//   )

//   if (masonry && view === FeedViewType.Pictures) {
//     return (
//       <>
//         <PictureMasonry
//           key={feedId}
//           hasNextPage={virtuosoOptions.totalCount! > virtuosoOptions.data.length}
//           endReached={virtuosoOptions.endReached}
//           data={nextData}
//         />

//         {virtuosoOptions.components?.Footer &&
//           (virtuosoOptions.components.Footer as FunctionComponent<VirtuosoComponentPropsContext>)({
//             context: { onlyShowArchivedButton: true },
//           })}

//         {FilteredContentTip}
//       </>
//     )
//   }
//   return (
//     <>
//       <VirtuosoGrid
//         id={ENTRY_COLUMN_LIST_SCROLLER_ID}
//         listClassName={girdClassNames}
//         {...virtuosoOptions}
//         data={nextData}
//         ref={virtuosoRef}
//       />
//       {FilteredContentTip}
//     </>
//   )
// }

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
