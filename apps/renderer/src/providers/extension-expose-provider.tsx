import { registerGlobalContext } from "@follow/shared/bridge"
import { env } from "@follow/shared/env"
import { useEffect, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { getGeneralSettings } from "~/atoms/settings/general"
import { getUISettings } from "~/atoms/settings/ui"
import { useModalStack } from "~/components/ui/modal"
import { FeedForm } from "~/modules/discover/feed-form"
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
      follow(id, options) {
        present({
          title: options?.isList
            ? t("sidebar.feed_actions.edit_list")
            : t("sidebar.feed_actions.edit_feed"),
          content: ({ dismiss }) => (
            <FeedForm asWidget id={id} onSuccess={dismiss} isList={options?.isList} />
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
