import type { FeedViewType } from "@follow/constants"
import { useQuery } from "@tanstack/react-query"

import { subscriptionActions, subscriptionSyncService, useSubscriptionStore } from "./store"

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
