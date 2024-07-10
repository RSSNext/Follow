import {
  setGeneralSetting,
  useGeneralSettingValue,
} from "@renderer/atoms/settings/general"
import { initPostHog } from "@renderer/initialize/posthog"
import { tipcClient } from "@renderer/lib/client"
import { useCallback, useEffect, useState } from "react"

import { SettingDescription, SettingSwitch } from "../control"
import { SettingItemGroup, SettingSectionTitle } from "../section"
import { SettingsTitle } from "../title"

export const SettingGeneral = () => {
  const [loginSetting, setLoginSetting] = useState(false)
  useEffect(() => {
    tipcClient?.getLoginItemSettings().then((settings) => {
      setLoginSetting(settings.openAtLogin)
    })
  }, [])

  const saveLoginSetting = useCallback((checked: boolean) => {
    tipcClient?.setLoginItemSettings(checked)
    setLoginSetting(checked)
  }, [])

  const settings = useGeneralSettingValue()

  return (
    <>
      <SettingsTitle />
      <div className="mt-6">
        {window.electron && (
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
        </SettingItemGroup>
      </div>
    </>
  )
}
