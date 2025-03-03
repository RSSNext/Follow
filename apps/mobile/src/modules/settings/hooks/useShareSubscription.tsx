import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/src/lib/api-fetch"

export const useShareSubscription = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["public", "subscription", userId],
    queryFn: async () => {
      const subscriptions = await apiClient.subscriptions.$get({
        query: {
          userId,
        },
      })

      return subscriptions
    },
  })
}
