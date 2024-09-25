import { registerGlobalContext } from "@follow/shared/bridge"
import { useEffect, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { getGeneralSettings } from "~/atoms/settings/general"
import { getUISettings } from "~/atoms/settings/ui"
import { useModalStack } from "~/components/ui/modal"
import { FeedForm } from "~/modules/discover/feed-form"

import { ElectronCloseEvent, ElectronShowEvent } from "./invalidate-query-provider"

export const ExtensionExposeProvider = () => {
  const { present } = useModalStack()
  useLayoutEffect(() => {
    registerGlobalContext({
      showSetting: (path) => window.router.showSettings(path),
      getGeneralSettings,
      getUISettings,
      /**
       * Electron app only
       */
      onWindowClose() {
        document.dispatchEvent(new ElectronCloseEvent())
      },
      onWindowShow() {
        document.dispatchEvent(new ElectronShowEvent())
      },

      toast,
    })
  }, [])

  const { t } = useTranslation()
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
    })
  }, [present, t])
  return null
}
