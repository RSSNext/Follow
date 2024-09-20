import { createElement, useCallback } from "react"
import { parse } from "tldts"

import { useModalStack } from "~/components/ui/modal"
import { NoopChildren } from "~/components/ui/modal/stacked/utils"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { capitalizeFirstLetter } from "~/lib/utils"

import { UserProfileModalContent } from "./user-profile-modal"

export const useUserSubscriptionsQuery = (userId: string | undefined) => {
  const subscriptions = useAuthQuery(
    defineQuery(["subscriptions", "group", userId], async () => {
      const res = await apiClient.subscriptions.$get({
        query: { userId },
      })
      const groupFolder = {} as Record<string, typeof res.data>

      for (const subscription of res.data || []) {
        if (!subscription.category && subscription.feeds) {
          const { siteUrl } = subscription.feeds
          if (!siteUrl) continue
          const parsed = parse(siteUrl)
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
    }),
    {
      enabled: !!userId,
    },
  )
  return subscriptions
}

export const usePresentUserProfileModal = (variant: "drawer" | "dialog" = "dialog") => {
  const { present } = useModalStack()

  return useCallback(
    (userId: string | undefined) => {
      if (!userId) return
      present({
        title: "User Profile",
        content: () =>
          createElement(UserProfileModalContent, {
            userId,
            variant,
          }),
        CustomModalComponent: NoopChildren,
        clickOutsideToDismiss: true,
        modal: variant === "dialog",
        overlay: variant === "dialog",
        modalContainerClassName: variant === "drawer" ? "right-4 left-[auto] top-4 bottom-4" : "",
      })
    },
    [present, variant],
  )
}
