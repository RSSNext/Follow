import { apiClient } from "@client/lib/api-fetch"
import { capitalizeFirstLetter, parseUrl } from "@follow/utils/utils"
import { useQuery } from "@tanstack/react-query"

export const useUserSubscriptionsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["subscriptions", "group", userId],
    queryFn: async () => {
      const res = await apiClient.subscriptions.$get({
        query: { userId },
      })
      const groupFolder = {} as Record<string, typeof res.data>
      for (const subscription of res.data || []) {
        if (!subscription.category && "feeds" in subscription) {
          const { siteUrl } = subscription.feeds
          if (!siteUrl) continue
          const parsed = parseUrl(siteUrl)
          parsed.domain && (subscription.category = capitalizeFirstLetter(parsed.domain))
        }
        if (subscription.category) {
          if (!groupFolder[subscription.category]) {
            groupFolder[subscription.category] = []
          }
          groupFolder[subscription.category].push(subscription)
        }
      }
      return groupFolder
    },
    enabled: !!userId,
  })
}
