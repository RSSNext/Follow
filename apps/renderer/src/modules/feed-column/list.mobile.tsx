import { cn } from "@follow/utils/utils"
import { forwardRef, memo, useImperativeHandle, useRef } from "react"
import { useTranslation } from "react-i18next"

import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"
import { useCategoryOpenStateByView } from "~/store/subscription"

import {
  EmptyFeedList,
  ListHeader,
  StarredItem,
  useFeedsGroupedData,
  useInboxesGroupedData,
  useListsGroupedData,
} from "./list.shared"
import { SortableFeedList, SortByAlphabeticalInbox, SortByAlphabeticalList } from "./sort-by"

const FeedListImpl = forwardRef<HTMLDivElement, { className?: string; view: number }>(
  ({ className, view }, ref) => {
    const feedsData = useFeedsGroupedData(view)
    const listsData = useListsGroupedData(view)
    const inboxesData = useInboxesGroupedData(view)
    const categoryOpenStateData = useCategoryOpenStateByView(view)

    const hasData =
      Object.keys(feedsData).length > 0 ||
      Object.keys(listsData).length > 0 ||
      Object.keys(inboxesData).length > 0

    const { t } = useTranslation()

    // Data prefetch
    useAuthQuery(Queries.lists.list())

    const hasListData = Object.keys(listsData).length > 0
    const hasInboxData = Object.keys(inboxesData).length > 0

    const scrollerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => scrollerRef.current!)

    return (
      <div className={cn(className, "font-medium")}>
        <ListHeader view={view} />

        <div ref={scrollerRef} className="h-full overflow-auto px-3">
          <StarredItem view={view} />
          {hasListData && (
            <>
              <div className="mt-1 flex h-6 w-full shrink-0 items-center rounded-md px-2.5 text-xs font-semibold text-theme-vibrancyFg transition-colors">
                {t("words.lists")}
              </div>
              <SortByAlphabeticalList view={view} data={listsData} />
            </>
          )}
          {hasInboxData && (
            <>
              <div className="mt-1 flex h-6 w-full shrink-0 items-center rounded-md px-2.5 text-xs font-semibold text-theme-vibrancyFg transition-colors">
                {t("words.inbox")}
              </div>
              <SortByAlphabeticalInbox view={view} data={inboxesData} />
            </>
          )}

          <div className="space-y-px" id="feeds-area">
            {(hasListData || hasInboxData) && (
              <div
                className={cn(
                  "mb-1 flex h-6 w-full shrink-0 items-center rounded-md px-2.5 text-xs font-semibold text-theme-vibrancyFg transition-colors",
                  Object.keys(feedsData).length === 0 ? "mt-0" : "mt-1",
                )}
              >
                {t("words.feeds")}
              </div>
            )}
            {hasData ? (
              <SortableFeedList
                view={view}
                data={feedsData}
                categoryOpenStateData={categoryOpenStateData}
              />
            ) : (
              <EmptyFeedList />
            )}
          </div>
        </div>
      </div>
    )
  },
)
FeedListImpl.displayName = "FeedListImpl"

export const FeedList = memo(FeedListImpl)
