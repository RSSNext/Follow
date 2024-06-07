import { AppearanceSwitch } from "@renderer/components/appearance-switch"
import { SettingsTitle } from "@renderer/components/settings/title"

export function Component() {
  return (
    <>
      <SettingsTitle path="" className="mb-4" />
      <AppearanceSwitch />
    </>
  )
}
