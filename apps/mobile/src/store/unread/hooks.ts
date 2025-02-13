import type { FeedViewType } from "@follow/constants"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"

import { useFeedSubscriptionByView } from "../subscription/hooks"
import { unreadSyncService, useUnreadStore } from "./store"

export const usePrefetchUnread = () => {
  return useQuery({
    queryKey: ["unread"],
    queryFn: () => unreadSyncService.fetch(),
    staleTime: 5 * 1000 * 60, // 5 minutes
  })
}

export const useAutoMarkAsRead = (entryId: string) => {
  const { mutate } = useMutation({
    mutationFn: (entryId: string) => unreadSyncService.markEntryAsRead(entryId),
  })
  useEffect(() => {
    mutate(entryId)
  }, [entryId, mutate])
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
  const subscriptionIds = useFeedSubscriptionByView(view)
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
