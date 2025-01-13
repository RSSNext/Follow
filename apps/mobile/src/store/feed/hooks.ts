import { useQuery } from "@tanstack/react-query"

import { feedSyncServices, useFeedStore } from "./store"

export const useFeed = (id: string) => {
  return useFeedStore((state) => {
    return state.feeds[id]
  })
}

export const usePrefetchFeed = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["feed", id],
    queryFn: () => feedSyncServices.fetchFeedById({ id }),
    ...options,
  })
}
