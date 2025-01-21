import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/src/lib/api-fetch"
import { useWhoami } from "@/src/store/user/hooks"

export const useShareSubscription = () => {
  const me = useWhoami()
  return useQuery({
    queryKey: ["public", "subscription"],
    queryFn: async () => {
      const subscriptions = await apiClient.subscriptions.$get({
        query: {
          userId: me!.id,
        },
      })

      return subscriptions
    },
    enabled: !!me,
  })
}
