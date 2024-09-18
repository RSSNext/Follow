import { SettingAppearance } from "@renderer/modules/settings/tabs/apperance"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-palette-cute-re"
const priority = 1010

export const loader = defineSettingPageData({
  iconName,
  name: "titles.appearance",
  priority,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <SettingAppearance />
    </>
  )
}
