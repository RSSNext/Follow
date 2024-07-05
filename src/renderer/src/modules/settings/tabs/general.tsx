import {
  setGeneralSetting,
  useGeneralSettingValue,
} from "@renderer/atoms/settings/general"
import { tipcClient } from "@renderer/lib/client"
import { useCallback, useEffect, useState } from "react"

import { SettingDescription, SettingSwitch } from "../control"
import { SettingSectionTitle } from "../section"
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
        <SettingSwitch
          checked={settings.unreadOnly}
          onCheckedChange={(checked) =>
            setGeneralSetting("unreadOnly", checked)}
          label="Show unread content initially"
        />
        <SettingDescription>
          Only show unread content initially when you open the app
        </SettingDescription>
        <SettingSectionTitle title="Mark read" />

        <SettingSwitch
          checked={settings.scrollMarkUnread}
          onCheckedChange={(checked) =>
            setGeneralSetting("scrollMarkUnread", checked)}
          label="Mark as read when scrolling"
        />
        <SettingDescription>
          Automatic marking of feed entries as read when the item is scrolled up
          out of the viewport.
        </SettingDescription>

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

        <SettingSwitch
          className="mt-6"
          checked={settings.renderMarkUnread}
          onCheckedChange={(checked) =>
            setGeneralSetting("renderMarkUnread", checked)}
          label="Mark as read when in the viewport"
        />
        <SettingDescription>
          Automatically mark feed entries with only one level of content(e.g. Social Media, Picture, Video views) as read when
          the item is in the viewport.
        </SettingDescription>

        <SettingSectionTitle title="Data control" />
        <SettingSwitch
          checked={settings.dataPersist}
          onCheckedChange={(checked) =>
            setGeneralSetting("dataPersist", checked)}
          label="Persist data to offline usage"
        />
        <SettingDescription>
          Data will be stored locally on your device for offline usage and speed
          up the data loading of the first screen. If you disable this, all
          local data will be removed.
        </SettingDescription>
      </div>
    </>
  )
}
