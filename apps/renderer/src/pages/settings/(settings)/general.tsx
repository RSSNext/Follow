import { SettingGeneral } from "~/modules/settings/tabs/general"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"

const iconName = "i-mgc-settings-7-cute-re"
const priority = 1000

export const loader = defineSettingPageData({
  iconName,
  name: "titles.general",
  priority,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <SettingGeneral />
    </>
  )
}
