import * as HoverCard from "@radix-ui/react-hover-card"
import { AnimatePresence, m } from "framer-motion"
import { Fragment, memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { useUISettingKey } from "~/atoms/settings/ui"
import { ScrollArea } from "~/components/ui/scroll-area"
import { IconOpacityTransition } from "~/components/ux/transition/icon"
import { FEED_COLLECTION_LIST, views } from "~/constants"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteFeedId } from "~/hooks/biz/useRouteParams"
import { useAuthQuery } from "~/hooks/common"
import { stopPropagation } from "~/lib/dom"
import type { FeedViewType } from "~/lib/enum"
import { cn, sortByAlphabet } from "~/lib/utils"
import { Queries } from "~/queries"
import { getPreferredTitle, useFeedStore } from "~/store/feed"
import { getSubscriptionByFeedId, useSubscriptionByView } from "~/store/subscription"
import { useFeedUnreadStore } from "~/store/unread"

import {
  getFeedListSort,
  setFeedListSortBy,
  setFeedListSortOrder,
  useFeedListSort,
  useFeedListSortSelector,
} from "./atom"
import { FeedCategory } from "./category"
import { UnreadNumber } from "./unread-number"

const useGroupedData = (view: FeedViewType) => {
  const { data: remoteData } = useAuthQuery(Queries.subscription.byView(view))

  const data = useSubscriptionByView(view) || remoteData

  return useMemo(() => {
    if (!data || data.length === 0) return {}

    const groupFolder = {} as Record<string, string[]>

    for (const subscription of data) {
      const category = subscription.category || subscription.defaultCategory
      if (category) {
        if (!groupFolder[category]) {
          groupFolder[category] = []
        }
        groupFolder[category].push(subscription.feedId)
      }
    }

    return groupFolder
  }, [data])
}

const useUpdateUnreadCount = () => {
  useAuthQuery(Queries.subscription.unreadAll(), {
    refetchInterval: false,
  })
}

function FeedListImpl({ className, view }: { className?: string; view: number }) {
  const [expansion, setExpansion] = useState(false)
  const data = useGroupedData(view)

  useUpdateUnreadCount()

  const totalUnread = useFeedUnreadStore((state) => {
    let unread = 0

    for (const category in data) {
      for (const feedId of data[category]) {
        unread += state.data[feedId] || 0
      }
    }
    return unread
  })

  const hasData = Object.keys(data).length > 0

  const feedId = useRouteFeedId()
  const navigate = useNavigateEntry()

  const { t } = useTranslation()

  return (
    <div className={cn(className, "font-medium")}>
      <div
        onClick={stopPropagation}
        className="mx-3 mb-2 flex items-center justify-between px-2.5 py-1"
      >
        <div
          className="font-bold"
          onClick={(e) => {
            e.stopPropagation()
            if (view !== undefined) {
              navigate({
                entryId: null,
                feedId: null,
                view,
              })
            }
          }}
        >
          {view !== undefined && t(views[view].name)}
        </div>
        <div className="ml-2 flex items-center gap-3 text-sm text-theme-vibrancyFg">
          <SortButton />
          {expansion ? (
            <i className="i-mgc-list-collapse-cute-re" onClick={() => setExpansion(false)} />
          ) : (
            <i className="i-mgc-list-expansion-cute-re" onClick={() => setExpansion(true)} />
          )}
          <UnreadNumber unread={totalUnread} className="text-xs !text-inherit" />
        </div>
      </div>
      <ScrollArea.ScrollArea mask={false} flex viewportClassName="!px-3" rootClassName="h-full">
        <div
          className={cn(
            "flex h-8 w-full shrink-0 items-center rounded-md px-2.5 transition-colors",
            feedId === FEED_COLLECTION_LIST && "bg-native-active",
          )}
          onClick={(e) => {
            e.stopPropagation()
            if (view !== undefined) {
              navigate({
                entryId: null,
                feedId: FEED_COLLECTION_LIST,
                view,
              })
            }
          }}
        >
          <i className="i-mgc-star-cute-fi mr-2 text-orange-500" />
          {t("words.starred")}
        </div>
        {hasData ? (
          <SortableList view={view} expansion={expansion} data={data} />
        ) : (
          <div className="flex h-full flex-1 items-center font-normal text-zinc-500">
            <Link
              to="/discover"
              className="absolute inset-0 mt-[-3.75rem] flex h-full flex-1 cursor-default flex-col items-center justify-center gap-2"
              onClick={stopPropagation}
            >
              <i className="i-mgc-add-cute-re text-3xl" />
              <span className="text-base">Add some feeds</span>
            </Link>
          </div>
        )}
      </ScrollArea.ScrollArea>
    </div>
  )
}

const SortButton = () => {
  const { by, order } = useFeedListSort()
  const { t } = useTranslation()
  const LIST = [
    { icon: "i-mgc-sort-ascending-cute-re", by: "count", order: "asc" },
    { icon: "i-mgc-sort-descending-cute-re", by: "count", order: "desc" },

    {
      icon: "i-mgc-az-sort-descending-letters-cute-re",
      by: "alphabetical",
      order: "asc",
    },
    {
      icon: "i-mgc-az-sort-ascending-letters-cute-re",
      by: "alphabetical",
      order: "desc",
    },
  ] as const

  const [open, setOpen] = useState(false)

  return (
    <HoverCard.Root open={open} onOpenChange={setOpen}>
      <HoverCard.Trigger
        onClick={() => {
          setFeedListSortBy(by === "count" ? "alphabetical" : "count")
        }}
        className="center"
      >
        <IconOpacityTransition
          icon2={
            order === "asc"
              ? tw`i-mgc-az-sort-descending-letters-cute-re`
              : tw`i-mgc-az-sort-ascending-letters-cute-re`
          }
          icon1={
            order === "asc" ? tw`i-mgc-sort-ascending-cute-re` : tw`i-mgc-sort-descending-cute-re`
          }
          status={by === "count" ? "init" : "done"}
        />
      </HoverCard.Trigger>

      <HoverCard.Portal forceMount>
        <HoverCard.Content className="z-10 -translate-x-4" sideOffset={5} forceMount>
          <AnimatePresence>
            {open && (
              <m.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="relative z-10 rounded-md border border-border bg-theme-modal-background-opaque p-3 shadow-md dark:shadow-zinc-500/20"
              >
                <HoverCard.Arrow className="-translate-x-4 fill-border" />
                <section className="w-[170px] text-center">
                  <span className="text-[13px]">{t("sidebar.select_sort_method")}</span>
                  <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-2">
                    {LIST.map(({ icon, by, order }) => {
                      const current = getFeedListSort()
                      const active = by === current.by && order === current.order
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setFeedListSortBy(by)
                            setFeedListSortOrder(order)
                          }}
                          key={`${by}-${order}`}
                          className={cn(
                            "center flex aspect-square rounded border border-border",

                            "ring-0 ring-accent/20 duration-200",
                            active && "border-accent bg-accent/5 ring-2",
                          )}
                        >
                          <i className={`${icon} size-5`} />
                        </button>
                      )
                    })}
                  </div>
                </section>
              </m.div>
            )}
          </AnimatePresence>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

type FeedListProps = {
  view: number
  expansion: boolean
  data: Record<string, string[]>
}
const SortByUnreadList = ({ view, expansion, data }: FeedListProps) => {
  const showUnreadCount = useUISettingKey("sidebarShowUnreadCount")
  const isDesc = useFeedListSortSelector((s) => s.order === "desc")

  const sortedByUnread = useFeedUnreadStore((state) => {
    const sortedList = [] as [string, string[]][]
    const folderUnread = {} as Record<string, number>
    // Calc total unread count for each folder
    for (const category in data) {
      folderUnread[category] = data[category].reduce((acc, cur) => (state.data[cur] || 0) + acc, 0)
    }

    // Sort by unread count
    Object.keys(folderUnread)
      .sort((a, b) => folderUnread[b] - folderUnread[a])
      .forEach((key) => {
        sortedList.push([key, data[key]])
      })

    if (!isDesc) {
      sortedList.reverse()
    }
    return sortedList
  })

  return (
    <Fragment>
      {sortedByUnread?.map(([category, ids]) => (
        <FeedCategory
          showUnreadCount={showUnreadCount}
          key={category}
          data={ids}
          view={view}
          expansion={expansion}
        />
      ))}
    </Fragment>
  )
}

const SortByAlphabeticalList = ({ view, expansion, data }: FeedListProps) => {
  const categoryName2RealDisplayNameMap = useFeedStore((state) => {
    const map = {} as Record<string, string>
    for (const categoryName in data) {
      const feedId = data[categoryName][0]

      if (!feedId) {
        continue
      }
      const feed = state.feeds[feedId]
      if (!feed) {
        continue
      }
      const hascategoryNameNotDefault = !!getSubscriptionByFeedId(feedId)?.category
      const isSingle = data[categoryName].length === 1
      if (!isSingle || hascategoryNameNotDefault) {
        map[categoryName] = categoryName
      } else {
        map[categoryName] = getPreferredTitle(feed)!
      }
    }
    return map
  })

  const isDesc = useFeedListSortSelector((s) => s.order === "desc")

  let sortedByAlphabetical = Object.keys(data).sort((a, b) => {
    const nameA = categoryName2RealDisplayNameMap[a]
    const nameB = categoryName2RealDisplayNameMap[b]
    return sortByAlphabet(nameA, nameB)
  })
  if (!isDesc) {
    sortedByAlphabetical = sortedByAlphabetical.reverse()
  }

  const showUnreadCount = useUISettingKey("sidebarShowUnreadCount")

  return (
    <Fragment>
      {sortedByAlphabetical.map((category) => (
        <FeedCategory
          showUnreadCount={showUnreadCount}
          key={category}
          data={data[category]}
          view={view}
          expansion={expansion}
        />
      ))}
    </Fragment>
  )
}

const SortableList = (props: FeedListProps) => {
  const by = useFeedListSortSelector((s) => s.by)

  switch (by) {
    case "count": {
      return <SortByUnreadList {...props} />
    }
    case "alphabetical": {
      return <SortByAlphabeticalList {...props} />
    }
  }
}

export const FeedList = memo(FeedListImpl)
