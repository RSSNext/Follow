import { getProviders } from "@hono/auth-js/react"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"

export const users = {
  profile: ({ userId }: { userId: string }) =>
    defineQuery(["profiles", userId], async () => {
      const res = await apiClient.profiles.$get({
        query: { id: userId! },
      })
      return res.data
    }),
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
