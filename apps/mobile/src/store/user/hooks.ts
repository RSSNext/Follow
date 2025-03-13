import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { useEffect } from "react"

import { apiClient } from "@/src/lib/api-fetch"
import { kv } from "@/src/lib/kv"

import { isNewUserQueryKey, isOnboardingFinishedStorageKey } from "./constants"
import { userSyncService, useUserStore } from "./store"

export const whoamiQueryKey = ["user", "whoami"]

export const usePrefetchSessionUser = () => {
  useQuery({
    queryKey: whoamiQueryKey,
    queryFn: () => userSyncService.whoami(),
  })
}

export const useWhoami = () => {
  return useUserStore((state) => state.whoami)
}

export const useUser = (userId?: string) => {
  return useUserStore((state) => (userId ? state.users[userId] : undefined))
}

export function useIsNewUser() {
  const { data } = useQuery({
    queryKey: isNewUserQueryKey,
    queryFn: async () => {
      const isOnboardingFinished = await kv.get(isOnboardingFinishedStorageKey)
      if (isOnboardingFinished) {
        return false
      }

      const subscriptions = await apiClient.subscriptions.$get({ query: {} })
      return subscriptions.data.length < 5
    },
  })
  return !!data
}

export function useOnboarding() {
  const isNewUser = useIsNewUser()
  useEffect(() => {
    if (isNewUser) {
      router.push("/onboarding")
    }
  }, [isNewUser])
}
