import type { FeedViewType } from "@follow/constants"
import { useQuery } from "@tanstack/react-query"

import { subscriptionSyncService, useSubscriptionStore } from "./store"

export const usePrefetchSubscription = (view: FeedViewType) => {
  return useQuery({
    queryKey: ["subscription", view],
    queryFn: () => subscriptionSyncService.fetch(view),
    staleTime: 30 * 1000 * 60, // 30 minutes
  })
}

export const useSubscriptionByView = (view: FeedViewType) => {
  return useSubscriptionStore((state) => {
    return state.feedIdByView[view]
  })
}

export const useSubscription = (id: string) => {
  return useSubscriptionStore((state) => {
    return state.data[id]
  })
}
