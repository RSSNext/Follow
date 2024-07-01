import { SettingAppearance } from "@renderer/modules/settings/tabs/apperance"
import { defineSettingPage } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-palette-cute-re"
const name = "Appearance"
const priority = 1010

export const loader = defineSettingPage({
  iconName,
  name,
  priority,
})

export function Component() {
  return <SettingAppearance />
}
