import { UnAuthorizedError } from "@renderer/biz/error"
import { defineQuery } from "@renderer/lib/defineQuery"
import type { SubscriptionResponse } from "@renderer/lib/types"
import { apiClient, apiFetch } from "@renderer/queries/api-fetch"
import { useQuery } from "@tanstack/react-query"
import { parse } from "tldts"

export type Response = {
  list: {
    list: SubscriptionResponse
    unread: number
    name: string
  }[]
  unread: number
}

export const subscription = {
  byView: (view?: number) =>
    defineQuery(["subscriptions", view], async () => {
      const res = await (
        await apiClient.subscriptions.$get({ query: { view: String(view) } })
      ).json()
      if (res.code === 1) {
        throw new UnAuthorizedError()
      }
      const subscriptions = res.data as SubscriptionResponse
      const categories = {
        list: {},
        unread: 0,
      } as {
        list: Record<
          string,
          {
            list: SubscriptionResponse
            unread: number
          }
        >
        unread: number
      }
      const domains: Record<string, number> = {}
      if (subscriptions) {
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
      if (subscriptions) {
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
              unread: 0,
            }
          }
          // const unread = counters.unreads[feed.id] || 0
          const unread = 0
          subscription.unread = unread
          categories.list[subscription.category].list.push(subscription)
          categories.list[subscription.category].unread += unread
          categories.unread += unread
        }
      }
      const list = Object.entries(categories.list)
        .map(([name, list]) => ({
          name,
          list: list.list.sort((a, b) => (b.unread || 0) - (a.unread || 0)),
          unread: list.unread,
        }))
        .sort((a, b) => b.unread - a.unread)
      return {
        list,
        unread: categories.unread,
      } as Response
    }),
  categories: (view?: number) =>
    defineQuery(["subscription-categories", view], async () => {
      const res = await (
        await apiClient.categories.$get({
          query: { view: String(view) },
        })
      ).json()
      if (res.code === 1) {
        throw new UnAuthorizedError()
      }
      return res.data
    }),
}

export const useSubscriptionCategories = (view?: number) =>
  useQuery({
    queryKey: ["subscription-categories", view],
    queryFn: async () => {
      const { data: categories } = await apiFetch<{
        code: number
        data: string[]
      }>("/categories", {
        query: {
          view,
        },
      })

      return categories || []
    },
  })
