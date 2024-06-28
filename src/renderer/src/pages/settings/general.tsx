import { useShouldUseIndexedDB } from "@renderer/database"
import { tipcClient } from "@renderer/lib/client"
import { SettingDescription, SettingSwitch } from "@renderer/modules/settings/control"
import { SettingSectionTitle } from "@renderer/modules/settings/section"
import { SettingsTitle } from "@renderer/modules/settings/title"
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

  const [shouldUseIndexedDB, setShouldUseIndexedDB] = useShouldUseIndexedDB()
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
        <SettingSectionTitle title="Data control" />
        <SettingSwitch
          checked={shouldUseIndexedDB}
          onCheckedChange={setShouldUseIndexedDB}
          label="Persist data to offline usage"
        />
        <SettingDescription>
          Data will be stored locally on your device for offline usage and speed up the data loading of the first screen. If you disable this, all local data will be removed.
        </SettingDescription>
      </div>
    </>
  )
}
