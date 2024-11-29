import { registerGlobalContext } from "@follow/shared/bridge"
import { env } from "@follow/shared/env"
import { useEffect, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { getGeneralSettings } from "~/atoms/settings/general"
import { getUISettings, useToggleZenMode } from "~/atoms/settings/ui"
import { setUpdaterStatus } from "~/atoms/updater"
import { useDialog, useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useDiscoverRSSHubRouteModal } from "~/hooks/biz/useDiscoverRSSHubRoute"
import { useFollow } from "~/hooks/biz/useFollow"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { useSettingModal } from "~/modules/settings/modal/use-setting-modal"
import { clearDataIfLoginOtherAccount } from "~/store/utils/clear"

declare module "@follow/components/providers/stable-router-provider.js" {
  interface CustomRoute {
    showSettings: (path?: string) => void
  }
}

export const ExtensionExposeProvider = () => {
  const { present } = useModalStack()
  const showSettings = useSettingModal()

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

      clearIfLoginOtherAccount(newUserId: string) {
        clearDataIfLoginOtherAccount(newUserId)
      },
      readyToUpdate() {
        setUpdaterStatus({
          type: "renderer",
          status: "ready",
        })
      },
    })
  }, [])
  useEffect(() => {
    // @ts-expect-error
    window.router ||= {}
    window.router.showSettings = showSettings
  }, [showSettings])

  const { t } = useTranslation()

  const follow = useFollow()
  const presentUserProfile = usePresentUserProfileModal("dialog")
  const presentDiscoverRSSHubRoute = useDiscoverRSSHubRouteModal()
  useEffect(() => {
    registerGlobalContext({
      follow,
      profile(id, variant) {
        presentUserProfile(id, variant)
      },
      rsshubRoute(route) {
        presentDiscoverRSSHubRoute(route)
      },
    })
  }, [follow, present, presentDiscoverRSSHubRoute, presentUserProfile, t])

  const toggleZenMode = useToggleZenMode()
  useEffect(() => {
    registerGlobalContext({
      zenMode: toggleZenMode,
    })
  }, [toggleZenMode])

  const dialog = useDialog()
  useEffect(() => {
    registerGlobalContext({
      dialog,
    })
  }, [dialog])
  return null
}
