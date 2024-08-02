import {
  setGeneralSetting,
  useGeneralSettingValue,
} from "@renderer/atoms/settings/general"
import { initPostHog } from "@renderer/initialize/posthog"
import { tipcClient } from "@renderer/lib/client"
import { clearLocalPersistStoreData } from "@renderer/store/utils/clear"
import { useCallback, useEffect } from "react"

import { createSettingBuilder } from "../setting-builder"
import { SettingsTitle } from "../title"

const SettingBuilder = createSettingBuilder(useGeneralSettingValue)
export const SettingGeneral = () => {
  useEffect(() => {
    tipcClient?.getLoginItemSettings().then((settings) => {
      setGeneralSetting("appLaunchOnStartup", settings.openAtLogin)
    })
  }, [])

  const saveLoginSetting = useCallback((checked: boolean) => {
    tipcClient?.setLoginItemSettings(checked)

    setGeneralSetting("appLaunchOnStartup", checked)
  }, [])

  return (
    <>
      <SettingsTitle />
      <div className="mt-4">
        <SettingBuilder
          settings={[
            {
              type: "title",
              value: "App",
              disabled: !window.electron,
            },
            {
              disabled: !window.electron,
              label: "Launch Follow at Login",
              key: "appLaunchOnStartup",
              onChange(value) {
                saveLoginSetting(value)
              },
            },
            {
              type: "title",
              value: "view",
            },
            {
              key: "unreadOnly",
              label: "Show unread content on launch",
              description:
                "Display only unread content when the app is launched.",
              onChange: (value) => setGeneralSetting("unreadOnly", value),
            },
            {
              key: "scrollMarkUnread",
              label: "Mark as read when scrolling",
              description:
                "Automatically mark entries as read when scrolled out of the view.",
              onChange: (value) => setGeneralSetting("scrollMarkUnread", value),
            },
            {
              key: "hoverMarkUnread",
              label: "Mark as read when hovering",
              description: "Automatically mark entries as read when hovered.",
              onChange: (value) => setGeneralSetting("hoverMarkUnread", value),
            },
            {
              key: "renderMarkUnread",
              label: "Mark as read when in the view",
              description:
                "Automatically mark single-level entries (e.g., social media posts, pictures, video views) as read when they enter the view.",
              onChange: (value) => setGeneralSetting("renderMarkUnread", value),
            },

            {
              type: "title",
              value: "Privacy & Data",
            },
            {
              key: "dataPersist",
              label: "Persist data for offline usage",
              description:
                "Persist data locally to enable offline access and local search.",
              onChange: (value) => setGeneralSetting("dataPersist", value),
            },
            {
              key: "sendAnonymousData",
              label: "Send anonymous data",
              description:
                "By opting to send anonymized telemetry data, you contribute to improving the overall user experience of Follow.",
              onChange: (value) => {
                setGeneralSetting("sendAnonymousData", value)
                if (value) {
                  initPostHog()
                } else {
                  window.posthog?.reset()
                  delete window.posthog
                }
              },
            },
            {
              label: "Rebuild Database",
              action: () => {
                clearLocalPersistStoreData()
                window.location.reload()
              },
              description:
                "If you are experiencing rendering issues, rebuilding the database may solve them.",
              buttonText: "Rebuild",
            },
          ]}
        />
      </div>
    </>
  )
}
