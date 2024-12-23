import type { FeedViewType } from "@follow/constants"
import { sortByAlphabet } from "@follow/utils"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { getFeed } from "../feed/getter"
import { getList } from "../list/getters"
import { getSubscription, getSubscriptionByView } from "./getter"
import { subscriptionSyncService, useSubscriptionStore } from "./store"

export const usePrefetchSubscription = (view: FeedViewType) => {
  return useQuery({
    queryKey: ["subscription", view],
    queryFn: () => subscriptionSyncService.fetch(view),
    staleTime: 30 * 1000 * 60, // 30 minutes
  })
}

const sortUngroupedSubscriptionByAlphabet = (
  leftSubscriptionId: string,
  rightSubscriptionId: string,
) => {
  const leftSubscription = getSubscription(leftSubscriptionId)
  const rightSubscription = getSubscription(rightSubscriptionId)

  if (!leftSubscription || !rightSubscription) return 0

  if (!leftSubscription.feedId || !rightSubscription.feedId) return 0
  const leftFeed = getFeed(leftSubscription.feedId)
  const rightFeed = getFeed(rightSubscription.feedId)

  if (!leftFeed || !rightFeed) return 0

  const comparedLeftTitle = leftSubscription.title || leftFeed.title!
  const comparedRightTitle = rightSubscription.title || rightFeed.title!

  return sortByAlphabet(comparedLeftTitle, comparedRightTitle)
}

export const useSubscriptionByView = (view: FeedViewType) => {
  return useSubscriptionStore(useCallback(() => getSubscriptionByView(view), [view]))
}

export const useGroupedSubscription = (view: FeedViewType) => {
  return useSubscriptionStore(
    useCallback(
      (state) => {
        const feedIds = state.feedIdByView[view]

        const grouped = {} as Record<string, string[]>
        const unGrouped = []

        for (const feedId of feedIds) {
          const subscription = state.data[feedId]
          if (!subscription) continue
          const { category } = subscription
          if (!category) {
            unGrouped.push(feedId)
            continue
          }
          if (!grouped[category]) {
            grouped[category] = []
          }
          grouped[category].push(feedId)
        }

        return {
          grouped,
          unGrouped,
        }
      },
      [view],
    ),
  )
}

const sortByUnread = (_leftSubscriptionId: string, _rightSubscriptionId: string) => {
  return 1
}
export const useSortedGroupedSubscription = (
  grouped: Record<string, string[]>,
  sortBy: "alphabet" | "unread",
) => {
  return useSubscriptionStore(
    useCallback(() => {
      const categories = Object.keys(grouped)
      const sortedCategories = categories.sort((a, b) => {
        if (sortBy === "alphabet") {
          return sortByAlphabet(a, b)
        }
        return sortByUnread(a, b)
      })
      const sortedList = [] as { category: string; subscriptionIds: string[] }[]
      for (const category of sortedCategories) {
        sortedList.push({ category, subscriptionIds: grouped[category] })
      }
      return sortedList
    }, [grouped, sortBy]),
  )
}

export const useSortedUngroupedSubscription = (ids: string[], sortBy: "alphabet" | "unread") => {
  return useSubscriptionStore(
    useCallback(() => {
      return ids.sort((a, b) => {
        if (sortBy === "alphabet") {
          return sortUngroupedSubscriptionByAlphabet(a, b)
        }
        return sortByUnread(a, b)
      })
    }, [ids, sortBy]),
  )
}

export const useSubscription = (id: string) => {
  return useSubscriptionStore((state) => {
    return state.data[id]
  })
}

export const useListSubscription = (view: FeedViewType) => {
  return useSubscriptionStore(
    useCallback(
      (state) => {
        return Array.from(state.listIdByView[view])
      },
      [view],
    ),
  )
}

export const useSortedListSubscription = (ids: string[], sortBy: "alphabet" | "unread") => {
  return useSubscriptionStore(() => {
    return ids.concat().sort((a, b) => {
      const leftList = getList(a)
      const rightList = getList(b)
      if (!leftList || !rightList) return 0
      if (sortBy === "alphabet") {
        return sortByAlphabet(leftList.title, rightList.title)
      }
      return sortByUnread(a, b)
    })
  })
}

export const useInboxSubscription = (view: FeedViewType) => {
  return useSubscriptionStore(
    useCallback(
      (state) => {
        return Array.from(state.inboxIdByView[view])
      },
      [view],
    ),
  )
}
