import { SettingAppearance } from "~/modules/settings/tabs/apperance"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"

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
