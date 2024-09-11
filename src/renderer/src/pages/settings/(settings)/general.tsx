import { SettingGeneral } from "@renderer/modules/settings/tabs/general"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-settings-7-cute-re"
const priority = 1000

export const loader = defineSettingPageData({
  iconName,
  name: "settings.titles.general",
  priority,
})

export function Component() {
  return <SettingGeneral />
}
