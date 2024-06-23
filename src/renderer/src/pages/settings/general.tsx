import { tipcClient } from "@renderer/lib/client"
import { SettingSwitch } from "@renderer/modules/settings/control"
import {
  SettingsTitle,
} from "@renderer/modules/settings/title"
import { defineSettingPage } from "@renderer/modules/settings/utils"
import { useCallback, useEffect, useState } from "react"

const iconName = "i-mgc-settings-7-cute-re"
const name = "General"
const priority = 1000

export const loader = defineSettingPage({
  iconName,
  name,
  priority,
})

export function Component() {
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

  return (
    <>
      <SettingsTitle />
      <div className="mt-6 space-y-6">
        {window.electron && (
          <SettingSwitch
            label="Launch Follow at Login"
            checked={loginSetting}
            onCheckedChange={saveLoginSetting}
          />
        )}
      </div>
    </>
  )
}
