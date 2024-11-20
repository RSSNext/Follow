import { stopPropagation } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import { forwardRef, memo, useImperativeHandle, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { FEED_COLLECTION_LIST } from "~/constants"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteFeedId } from "~/hooks/biz/useRouteParams"
import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"
import { useCategoryOpenStateByView } from "~/store/subscription"

import {
  ListHeader,
  useFeedsGroupedData,
  useInboxesGroupedData,
  useListsGroupedData,
} from "./list.shared"
import { SortableFeedList, SortByAlphabeticalInbox, SortByAlphabeticalList } from "./sort-by"
import { feedColumnStyles } from "./styles"

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

    const feedId = useRouteFeedId()
    const navigateEntry = useNavigateEntry()

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
          <div
            data-active={feedId === FEED_COLLECTION_LIST}
            className={cn(
              "mt-1 flex h-8 w-full shrink-0 cursor-menu items-center gap-2 rounded-md px-2.5",
              feedColumnStyles.item,
            )}
            onClick={(e) => {
              e.stopPropagation()
              if (view !== undefined) {
                navigateEntry({
                  entryId: null,
                  feedId: FEED_COLLECTION_LIST,
                  view,
                })
              }
            }}
          >
            <i className="i-mgc-star-cute-fi size-4 -translate-y-px text-amber-500" />
            {t("words.starred")}
          </div>
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
              <div className="flex h-full flex-1 items-center font-normal text-zinc-500">
                <Link
                  to="/discover"
                  className="absolute inset-0 mt-[-3.75rem] flex h-full flex-1 cursor-menu flex-col items-center justify-center gap-2"
                  onClick={stopPropagation}
                >
                  <i className="i-mgc-add-cute-re text-3xl" />
                  <span className="text-base">{t("sidebar.add_more_feeds")}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
)
FeedListImpl.displayName = "FeedListImpl"

export const FeedList = memo(FeedListImpl)
