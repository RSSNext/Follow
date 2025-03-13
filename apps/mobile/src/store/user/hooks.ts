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
      const subscriptions = await apiClient.subscriptions.$get({ query: {} })
      const isOnboardingFinished = await kv.get(isOnboardingFinishedStorageKey)

      return subscriptions.data.length < 5 && !isOnboardingFinished
    },
  })
  return !!data
}

export function useOnboarding() {
  const isNewUser = useIsNewUser()
  useEffect(() => {
    if (isNewUser) {
      // @ts-expect-error
      router.push("/onboarding")
    }
  }, [isNewUser])
}
