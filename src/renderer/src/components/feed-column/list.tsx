import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { levels, views } from "@renderer/lib/constants"
import { stopPropagation } from "@renderer/lib/dom"
import type { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import type { FeedListModel, SubscriptionResponse } from "@renderer/models"
import { Queries } from "@renderer/queries"
import {
  feedActions,
  useFeedActiveList,
  useUnreadStore,
} from "@renderer/store"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { parse } from "tldts"

import { FeedCategory } from "./category"

const useData = (view?: FeedViewType) => {
  const query = useBizQuery(Queries.subscription.byView(view))

  // TODO Refactor this into category store
  return useMemo(() => {
    if (!query.data) return null
    const categories = {
      list: {},
    } as {
      list: Record<
        string,
        {
          list: SubscriptionResponse
        }
      >
    }
    const domains: Record<string, number> = {}
    const subscriptions = structuredClone(query.data)

    if (query) {
      for (const subscription of subscriptions) {
        if (!subscription.category && subscription.feeds.siteUrl) {
          const { domain } = parse(subscription.feeds.siteUrl)
          if (domain) {
            if (!domains[domain]) {
              domains[domain] = 0
            }
            domains[domain]++
          }
        }
      }
    }
    if (query) {
      for (const subscription of subscriptions) {
        if (!subscription.category) {
          if (subscription.feeds.siteUrl) {
            const { domain } = parse(subscription.feeds.siteUrl)
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
    }
    const list = Object.entries(categories.list).map(([name, list]) => ({
      name,
      list: list.list,
    }))

    return {
      list,
    } as FeedListModel
  }, [query])
}
export function FeedList({
  className,
  view,
  hideTitle,
}: {
  className?: string
  view?: number
  hideTitle?: boolean
}) {
  const [expansion, setExpansion] = useState(false)
  const data = useData(view)
  const activeList = useFeedActiveList()

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

  const { setActiveList } = feedActions

  const sortedByUnread = useUnreadStore((state) =>
    data?.list?.sort(
      (a, b) =>
        b.list.reduce((acc, cur) => (state.data[cur.feedId] || 0) + acc, 0) -
        a.list.reduce((acc, cur) => (state.data[cur.feedId] || 0) + acc, 0),
    ),
  )

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
                setActiveList({
                  level: levels.view,
                  id: view,
                  name: views[view].name,
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
                className="i-mingcute-list-collapse-fill"
                onClick={() => setExpansion(false)}
              />
            ) : (
              <i
                className="i-mingcute-list-expansion-fill"
                onClick={() => setExpansion(true)}
              />
            )}
            <span>{totalUnread}</span>
          </div>
        </div>
      )}
      <div
        className={cn(
          "flex h-8 w-full items-center rounded-md px-2.5 transition-colors",
          activeList?.id === "collections" && "bg-native-active",
        )}
        onClick={(e) => {
          e.stopPropagation()
          if (view !== undefined) {
            setActiveList({
              level: levels.folder,
              id: "collections",
              name: "Collections",
              view,
            })
          }
        }}
      >
        <i className="i-mingcute-star-fill mr-2 text-orange-500" />
        Starred
      </div>
      {data?.list?.length ?
        sortedByUnread?.map((category) => (
          <FeedCategory
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
                <i className="i-mingcute-add-line text-3xl " />
                Add some feeds
              </Link>
            </div>
          )}
    </div>
  )
}
