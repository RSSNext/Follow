import { isMobile } from "@follow/components/hooks/useMobile.js"
import { capitalizeFirstLetter } from "@follow/utils/utils"
import { createElement, lazy, useCallback } from "react"
import { parse } from "tldts"

import { useAsyncModal } from "~/components/ui/modal/helper/use-async-modal"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { users } from "~/queries/users"

const LazyUserProfileModalContent = lazy(() =>
  import("./user-profile-modal").then((mod) => ({ default: mod.UserProfileModalContent })),
)

export const useUserSubscriptionsQuery = (userId: string | undefined) => {
  const subscriptions = useAuthQuery(
    defineQuery(["subscriptions", "group", userId], async () => {
      const res = await apiClient.subscriptions.$get({
        query: { userId },
      })
      const groupFolder = {} as Record<string, typeof res.data>

      for (const subscription of res.data || []) {
        if (!subscription.category && "feeds" in subscription) {
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

type Variant = "drawer" | "dialog"
export const usePresentUserProfileModal = (variant: Variant = "dialog") => {
  const { present } = useModalStack()
  const presentAsync = useAsyncModal()
  return useCallback(
    (userId: string | undefined, overrideVariant?: Variant) => {
      if (!userId) return
      const finalVariant = overrideVariant || variant

      if (isMobile()) {
        const useDataFetcher = () => {
          const user = useAuthQuery(users.profile({ userId }))
          const subscriptions = useUserSubscriptionsQuery(user.data?.id)
          return {
            ...user,
            isLoading: user.isLoading || subscriptions.isLoading,
          }
        }
        type ResponseType = Awaited<ReturnType<ReturnType<typeof useDataFetcher>["fn"]>>
        return presentAsync<ResponseType>({
          id: `user-profile-${userId}`,
          title: (data: ResponseType) => `${data.name}'s Profile`,

          content: () => createElement(LazyUserProfileModalContent, { userId }),
          useDataFetcher,
          overlay: true,
        })
      }

      present({
        title: "User Profile",
        id: `user-profile-${userId}`,
        content: () =>
          createElement(LazyUserProfileModalContent, {
            userId,
            variant: finalVariant,
          }),
        CustomModalComponent: PlainModal,
        clickOutsideToDismiss: true,
        modal: finalVariant === "dialog",
        overlay: finalVariant === "dialog",
        autoFocus: false,
        modalContainerClassName:
          finalVariant === "drawer"
            ? tw`right-4 left-[auto] safe-inset-top-4 bottom-4`
            : "overflow-hidden",
      })
    },
    [present, presentAsync, variant],
  )
}
