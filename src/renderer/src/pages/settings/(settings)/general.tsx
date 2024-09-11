import { SettingGeneral } from "@renderer/modules/settings/tabs/general"
import { defineSettingPage } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-settings-7-cute-re"
const name = "settings.general.sidebar_title"
const priority = 1000

export const loader = defineSettingPage({
  iconName,
  name,
  priority,
})

export function Component() {
  return <SettingGeneral />
}
