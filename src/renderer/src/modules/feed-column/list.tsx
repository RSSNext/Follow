import { useUISettingKey } from "@renderer/atoms"
import { useBizQuery } from "@renderer/hooks"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteFeedId } from "@renderer/hooks/biz/useRouteParams"
import { FEED_COLLECTION_LIST, levels, views } from "@renderer/lib/constants"
import { stopPropagation } from "@renderer/lib/dom"
import type { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import type { FeedListModel } from "@renderer/models"
import { Queries } from "@renderer/queries"
import type { SubscriptionPlainModel } from "@renderer/store"
import {
  getFeedById,
  useSubscriptionByView,
  useUnreadStore,
} from "@renderer/store"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { parse } from "tldts"

import { FeedCategory } from "./category"

const useData = (view: FeedViewType) => {
  const { data: remoteData } = useBizQuery(Queries.subscription.byView(view))

  const data = useSubscriptionByView(view) || remoteData

  // TODO Refactor this into category store
  return useMemo(() => {
    const categories = {
      list: {},
    } as {
      list: Record<
        string,
        {
          list: SubscriptionPlainModel[]
        }
      >
    }
    const domains: Record<string, number> = {}
    const subscriptions = structuredClone(data)

    for (const subscription of subscriptions) {
      const feed = getFeedById(subscription.feedId)
      if (!subscription.category && feed && feed.siteUrl) {
        const { domain } = parse(feed.siteUrl)
        if (domain) {
          if (!domains[domain]) {
            domains[domain] = 0
          }
          domains[domain]++
        }
      }
    }

    for (const subscription of subscriptions) {
      const feed = getFeedById(subscription.feedId)
      if (!feed) continue
      if (!subscription.category) {
        if (feed.siteUrl) {
          // FIXME @DIYgod
          // The logic here makes it impossible to remove the auto-generated category based on domain
          const { domain } = parse(feed.siteUrl)
          if (domain && domains[domain] > 1) {
            subscription.category =
              domain.slice(0, 1).toUpperCase() + domain.slice(1)
          }
        }
        if (!subscription.category) {
          subscription.category = ""
        }
      }
      if (!categories.list[subscription.category]) {
        categories.list[subscription.category] = {
          list: [],
        }
      }

      categories.list[subscription.category].list.push(subscription)
    }

    const list = Object.entries(categories.list).map(([name, list]) => ({
      name,
      list: list.list,
    }))

    return {
      list,
    } as FeedListModel
  }, [data])
}
export function FeedList({
  className,
  view,
  hideTitle,
}: {
  className?: string
  view: number
  hideTitle?: boolean
}) {
  const [expansion, setExpansion] = useState(false)
  const data = useData(view)

  useBizQuery(Queries.subscription.unreadAll())

  const totalUnread = useUnreadStore((state) => {
    let unread = 0
    data?.list.forEach((a) => {
      a.list.forEach((b) => {
        unread += state.data[b.feedId] || 0
      })
    })
    return unread
  })

  const sortedByUnread = useUnreadStore((state) =>
    data?.list?.sort(
      (a, b) =>
        b.list.reduce((acc, cur) => (state.data[cur.feedId] || 0) + acc, 0) -
        a.list.reduce((acc, cur) => (state.data[cur.feedId] || 0) + acc, 0),
    ),
  )

  const feedId = useRouteFeedId()
  const navigate = useNavigateEntry()
  const showUnreadCount = useUISettingKey("sidebarShowUnreadCount")

  return (
    <div className={cn(className, "font-medium")}>
      {!hideTitle && (
        <div
          onClick={stopPropagation}
          className={cn("mb-2 flex items-center justify-between px-2.5 py-1")}
        >
          <div
            className="font-bold"
            onClick={(e) => {
              e.stopPropagation()
              if (view !== undefined) {
                navigate({
                  entryId: null,
                  feedId: null,
                  level: levels.view,
                  view,
                })
              }
            }}
          >
            {view !== undefined && views[view].name}
          </div>
          <div className="ml-2 flex items-center gap-3 text-sm text-theme-vibrancyFg">
            {expansion ? (
              <i
                className="i-mgc-list-collapse-cute-fi"
                onClick={() => setExpansion(false)}
              />
            ) : (
              <i
                className="i-mgc-list-expansion-cute-fi"
                onClick={() => setExpansion(true)}
              />
            )}
            <span>{totalUnread}</span>
          </div>
        </div>
      )}
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
              level: levels.folder,
              view,
              category: "",
            })
          }
        }}
      >
        <i className="i-mgc-star-cute-fi mr-2 text-orange-500" />
        Starred
      </div>
      {data?.list?.length ?
        sortedByUnread?.map((category) => (
          <FeedCategory
            showUnreadCount={showUnreadCount}
            key={category.name}
            data={category}
            view={view}
            expansion={expansion}
          />
        )) :
          !hideTitle && (
            <div className="flex h-full flex-1 items-center text-zinc-500">
              <Link
                to="/discover"
                className="-mt-36 flex h-full flex-1 flex-col items-center justify-center gap-2"
              >
                <i className="i-mgc-add-cute-re text-3xl" />
                Add some feeds
              </Link>
            </div>
          )}
    </div>
  )
}
