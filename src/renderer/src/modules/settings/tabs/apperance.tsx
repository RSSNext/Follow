import { useDark } from "@renderer/hooks"
import { getOS } from "@renderer/lib/utils"
import { uiActions, useUIStore } from "@renderer/store"
import { useCallback } from "react"

import { SettingSwitch } from "../control"
import { SettingSectionTitle } from "../section"
import { SettingsTitle } from "../title"

export const SettingAppearance = () => {
  const { isDark, toggleDark } = useDark()
  const saveDarkSetting = useCallback(() => {
    toggleDark()
  }, [])

  const state = useUIStore()

  return (
    <div>
      <SettingsTitle />
      <SettingSectionTitle title="General" />
      <SettingSwitch
        label="Dark Mode"
        checked={isDark}
        onCheckedChange={saveDarkSetting}
      />
      {window.electron && getOS() === "macOS" && (
        <SettingSwitch
          label="Opaque Sidebars"
          checked={state.opaqueSidebar}
          onCheckedChange={(checked) => {
            uiActions.set("opaqueSidebar", checked)
          }}
        />
      )}
    </div>
  )
}
