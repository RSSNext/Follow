import { SettingIntegration } from "@renderer/modules/settings/tabs/integration"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-department-cute-re"
const priority = 1025

export const loader = defineSettingPageData({
  iconName,
  name: "settings:titles.integration",
  priority,
})

export function Component() {
  return <SettingIntegration />
}
