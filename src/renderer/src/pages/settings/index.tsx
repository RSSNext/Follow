import { Checkbox } from "@renderer/components/ui/checkbox"
import { Label } from "@renderer/components/ui/label"
import { useDark } from "@renderer/hooks"
import { tipcClient } from "@renderer/lib/client"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export function Component() {
  const { isDark, toggleDark } = useDark()

  const [loginSetting, setLoginSetting] = useState(false)
  useEffect(() => {
    tipcClient?.getLoginItemSettings().then((settings) => {
      setLoginSetting(settings.openAtLogin)
    })
  }, [])

  const saveLoginSetting = useCallback((checked: boolean) => {
    tipcClient?.setLoginItemSettings(checked)
    setLoginSetting(checked)
    toast.success("Settings saved.")
  }, [])

  const saveDarkSetting = useCallback(() => {
    toggleDark()
    toast.success("Settings saved.")
  }, [])

  return (
    <>
      <SettingsTitle path="" sticky className="mb-4" />
      <div className="mt-6 space-y-6">
        <div className="flex items-center gap-4">
          <Checkbox
            id="launch"
            checked={loginSetting}
            onCheckedChange={saveLoginSetting}
          />
          <Label htmlFor="launch">Launch Follow at Login</Label>
        </div>
        <div className="flex items-center gap-4">
          <Checkbox id="dark" checked={isDark} onCheckedChange={saveDarkSetting} />
          <Label htmlFor="dark">Dark Mode</Label>
        </div>
      </div>
    </>
  )
}
