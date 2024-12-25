import type { FeedViewType } from "@follow/constants"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { useSubscriptionByView } from "../subscription/hooks"
import { unreadSyncService, useUnreadStore } from "./store"

export const usePrefetchUnread = () => {
  return useQuery({
    queryKey: ["unread"],
    queryFn: () => unreadSyncService.fetch(),
    staleTime: 5 * 1000 * 60, // 5 minutes
  })
}

export const useUnreadCount = (subscriptionId: string) => {
  return useUnreadStore((state) => state.data[subscriptionId])
}

export const useUnreadCounts = (subscriptionIds: string[]): number => {
  return useUnreadStore(
    useCallback(
      (state) => {
        let count = 0
        for (const subscriptionId of subscriptionIds) {
          count += state.data[subscriptionId] ?? 0
        }
        return count
      },
      [subscriptionIds],
    ),
  )
}

export const useUnreadCountByView = (view: FeedViewType) => {
  const subscriptionIds = useSubscriptionByView(view)
  return useUnreadStore(
    useCallback(
      (state) => {
        let count = 0
        for (const subscriptionId of subscriptionIds) {
          count += state.data[subscriptionId] ?? 0
        }
        return count
      },
      [subscriptionIds],
    ),
  )
}
