import type { FeedViewType } from "@follow/constants"
import { useQuery } from "@tanstack/react-query"

import { getFeed } from "../feed/getter"
import { getSubscription } from "./getter"
import { subscriptionSyncService, useSubscriptionStore } from "./store"

export const usePrefetchSubscription = (view: FeedViewType) => {
  return useQuery({
    queryKey: ["subscription", view],
    queryFn: () => subscriptionSyncService.fetch(view),
    staleTime: 30 * 1000 * 60, // 30 minutes
  })
}

const sortByAlphabet = (leftSubscriptionId: string, rightSubscriptionId: string) => {
  const leftSubscription = getSubscription(leftSubscriptionId)
  const rightSubscription = getSubscription(rightSubscriptionId)

  if (!leftSubscription || !rightSubscription) return 0

  const leftFeed = getFeed(leftSubscription.feedId)
  const rightFeed = getFeed(rightSubscription.feedId)

  if (!leftFeed || !rightFeed) return 0

  const comparedLeftTitle = leftSubscription.title || leftFeed.title!
  const comparedRightTitle = rightSubscription.title || rightFeed.title!

  const isALetter = /^[a-z]/i.test(comparedLeftTitle)
  const isBLetter = /^[a-z]/i.test(comparedRightTitle)

  if (isALetter && !isBLetter) {
    return -1
  }
  if (!isALetter && isBLetter) {
    return 1
  }

  if (isALetter && isBLetter) {
    return comparedLeftTitle.localeCompare(comparedRightTitle)
  } else {
    return comparedLeftTitle.localeCompare(comparedRightTitle, "zh-CN")
  }
}

export const useSubscriptionByView = (
  view: FeedViewType,
  sortBy: "alphabet" | "unread" = "alphabet",
) => {
  return useSubscriptionStore((state) => {
    const feedIds = state.feedIdByView[view]
    if (sortBy === "alphabet") {
      return feedIds.concat().sort(sortByAlphabet)
    }
    // TODO: sort by unread
    return feedIds
  })
}

export const useSubscription = (id: string) => {
  return useSubscriptionStore((state) => {
    return state.data[id]
  })
}
