import { useQuery } from "@tanstack/react-query"
import { SubscriptionResponse } from "./types"

export type Response = {
  list: {
    list: SubscriptionResponse
    unread: number
    name: string
  }[]
  unread: number
}

export const useSubscriptions = (view?: number) =>
  useQuery({
    queryKey: ["subscriptions", view],
    queryFn: async () => {
      const subscriptions = (
        await (
          await fetch(
            `${import.meta.env.VITE_ELECTRON_REMOTE_API_URL}/subscriptions` +
              (view !== undefined ? `?view=${view}` : ``),
            {
              credentials: "include",
            },
          )
        ).json()
      ).data as SubscriptionResponse
      // const counters = await (
      //   await fetch(
      //     `${import.meta.env.VITE_MINIFLUX_ENDPOINT}/v1/feeds/counters`,
      //     {
      //       headers: {
      //         "X-Auth-Token": import.meta.env.VITE_MINIFLUX_TOKEN,
      //       },
      //     },
      //   )
      // ).json()

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
      subscriptions?.forEach((subscription) => {
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
      })
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
    },
  })
