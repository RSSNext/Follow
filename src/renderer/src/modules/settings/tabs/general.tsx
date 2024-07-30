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
                "Automatic marking of feed entries as read when scrolled out of the view.",
              onChange: (value) => setGeneralSetting("scrollMarkUnread", value),
            },
            {
              key: "hoverMarkUnread",
              label: "Mark as read when hovering",
              description:
                "Automatic marking of feed entries as read when hovered.",
              onChange: (value) => setGeneralSetting("hoverMarkUnread", value),
            },
            {
              key: "renderMarkUnread",
              label: "Mark as read when in the view",
              description:
                "Automatically mark single-level content feed entries (e.g., social media posts, pictures, video views) as read once they enter the view.",
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

        {/* {window.electron && (
          <SettingSwitch
            label="Launch Follow at Login"
            checked={loginSetting}
            onCheckedChange={saveLoginSetting}
          />
        )}

        <SettingSectionTitle title="view" />
        <SettingItemGroup>
          <SettingSwitch
            checked={settings.unreadOnly}
            onCheckedChange={(checked) =>
              setGeneralSetting("unreadOnly", checked)}
            label="Show unread content initially"
          />
          <SettingDescription>
            Only show unread content initially when you open the app
          </SettingDescription>
        </SettingItemGroup>
        <SettingSectionTitle title="Mark read" />

        <SettingItemGroup>
          <SettingSwitch
            checked={settings.scrollMarkUnread}
            onCheckedChange={(checked) =>
              setGeneralSetting("scrollMarkUnread", checked)}
            label="Mark as read when scrolling"
          />
          <SettingDescription>
            Automatic marking of feed entries as read when the item is scrolled
            up out of the viewport.
          </SettingDescription>
        </SettingItemGroup>

        <SettingItemGroup>
          <SettingSwitch
            className="mt-6"
            checked={settings.hoverMarkUnread}
            onCheckedChange={(checked) =>
              setGeneralSetting("hoverMarkUnread", checked)}
            label="Mark as read when hovering"
          />
          <SettingDescription>
            Automatic marking of feed entries as read when the item is hovered.
          </SettingDescription>
        </SettingItemGroup>
        <SettingItemGroup>
          <SettingSwitch
            className="mt-6"
            checked={settings.renderMarkUnread}
            onCheckedChange={(checked) =>
              setGeneralSetting("renderMarkUnread", checked)}
            label="Mark as read when in the viewport"
          />
          <SettingDescription>
            Automatically mark feed entries with only one level of content(e.g.
            Social Media, Picture, Video views) as read when the item is in the
            viewport.
          </SettingDescription>
        </SettingItemGroup>

        <SettingSectionTitle title="Data control" />
        <SettingItemGroup>
          <SettingSwitch
            checked={settings.dataPersist}
            onCheckedChange={(checked) =>
              setGeneralSetting("dataPersist", checked)}
            label="Persist data to offline usage"
          />
          <SettingDescription>
            Data will be stored locally on your device for offline usage and
            speed up the data loading of the first screen. If you disable this,
            all local data will be removed.
          </SettingDescription>
        </SettingItemGroup>
        <SettingItemGroup>
          <SettingSwitch
            className="mt-6"
            checked={settings.sendAnonymousData}
            onCheckedChange={(checked) => {
              setGeneralSetting("sendAnonymousData", checked)

              if (checked) {
                initPostHog()
              } else {
                window.posthog?.reset()
                delete window.posthog
              }
            }}
            label="Send anonymous data"
          />
          <SettingDescription>
            By selecting to send telemetry data, you can help us improve the
            overall user experience of
            {" "}
            {APP_NAME}
          </SettingDescription>
        </SettingItemGroup> */}
      </div>
    </>
  )
}
