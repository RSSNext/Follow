import { apiClient } from "@client/lib/api-fetch"
import { getHydrateData } from "@client/lib/helper"
import { capitalizeFirstLetter, isBizId, parseUrl } from "@follow/utils/utils"
import { getProviders } from "@hono/auth-js/react"
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

export const fetchUser = async (handleOrId: string | undefined) => {
  const handle = isBizId(handleOrId || "")
    ? handleOrId
    : `${handleOrId}`.startsWith("@")
      ? `${handleOrId}`.slice(1)
      : handleOrId

  const res = await apiClient.profiles.$get({
    query: {
      handle,
      id: isBizId(handle || "") ? handle : undefined,
    },
  })
  return res.data
}

export const useUserQuery = (handleOrId: string | undefined) => {
  return useQuery({
    queryKey: ["profiles", handleOrId],
    queryFn: () => fetchUser(handleOrId),
    enabled: !!handleOrId,
    initialData: getHydrateData(`profiles.$get,query:id=${handleOrId}`),
  })
}

export const useAuthProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: () => getProviders(),
    placeholderData: {
      google: {
        id: "google",
        name: "Google",
      },
      github: {
        id: "github",
        name: "GitHub",
      },
    } as Awaited<ReturnType<typeof getProviders>>,
  })
}
