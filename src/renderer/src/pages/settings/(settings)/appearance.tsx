import { SettingAppearance } from "@renderer/modules/settings/tabs/apperance"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-palette-cute-re"

const priority = 1010

export const loader = defineSettingPageData({
  iconName,
  name: "settings.titles.appearance",
  priority,
})

export function Component() {
  return <SettingAppearance />
}
