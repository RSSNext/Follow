import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { levels, views } from "@renderer/lib/constants"
import type { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import type { FeedListModel, SubscriptionResponse } from "@renderer/models"
import { Queries } from "@renderer/queries"
import { feedActions, useUnreadStore } from "@renderer/store"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { parse } from "tldts"

import { FeedCategory } from "./category"

const useData = (view?: FeedViewType) => {
  const subscriptions = useBizQuery(Queries.subscription.byView(view))

  // TODO Refactor this into category store
  return useMemo(() => {
    if (!subscriptions.data) return null
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
    const data = structuredClone(subscriptions.data)

    if (subscriptions) {
      for (const subscription of data.subscriptions) {
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
    if (subscriptions) {
      for (const subscription of data.subscriptions) {
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

        const unread = data.unreads[subscription.feedId] || 0
        subscription.unread = unread
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
  }, [subscriptions])
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
    <div className={className}>
      {!hideTitle && (
        <div
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
      {data?.list?.length ? (
        sortedByUnread?.map((category) => (
          <FeedCategory
            key={category.name}
            data={category}
            view={view}
            expansion={expansion}
          />
        ))
      ) : (
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
        )
      )}
    </div>
  )
}
