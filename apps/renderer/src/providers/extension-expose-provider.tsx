import { registerGlobalContext } from "@follow/shared/bridge"
import { env } from "@follow/shared/env"
import { useEffect, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { getGeneralSettings } from "~/atoms/settings/general"
import { getUISettings } from "~/atoms/settings/ui"
import { useModalStack } from "~/components/ui/modal"
import { FeedForm } from "~/modules/discover/feed-form"
import { ListForm } from "~/modules/discover/list-form"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"

export const ExtensionExposeProvider = () => {
  const { present } = useModalStack()
  useLayoutEffect(() => {
    registerGlobalContext({
      showSetting: (path) => window.router.showSettings(path),
      getGeneralSettings,
      getUISettings,

      toast,
      getApiUrl() {
        return env.VITE_API_URL
      },
      getWebUrl() {
        return window.location.origin
      },
    })
  }, [])

  const { t } = useTranslation()

  const presentUserProfile = usePresentUserProfileModal("dialog")
  useEffect(() => {
    registerGlobalContext({
      follow(options) {
        present({
          title: options?.isList
            ? t("sidebar.feed_actions.edit_list")
            : t("sidebar.feed_actions.edit_feed"),
          content: ({ dismiss }) =>
            options?.isList ? (
              <ListForm asWidget id={options?.id} onSuccess={dismiss} />
            ) : (
              <FeedForm asWidget id={options?.id} url={options?.url} onSuccess={dismiss} />
            ),
        })
      },

      profile(id, variant) {
        presentUserProfile(id, variant)
      },
    })
  }, [present, presentUserProfile, t])
  return null
}
