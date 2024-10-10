import { registerGlobalContext } from "@follow/shared/bridge"
import { env } from "@follow/shared/env"
import { useEffect, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { getGeneralSettings } from "~/atoms/settings/general"
import { getUISettings } from "~/atoms/settings/ui"
import { useModalStack } from "~/components/ui/modal"
import { useFollow } from "~/hooks/biz/useFollow"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { useSettingModal } from "~/modules/settings/modal/hooks"
import { clearDataIfLoginOtherAccount } from "~/store/utils/clear"

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
  useEffect(() => {
    registerGlobalContext({
      follow,

      profile(id, variant) {
        presentUserProfile(id, variant)
      },
    })
  }, [follow, present, presentUserProfile, t])
  return null
}
