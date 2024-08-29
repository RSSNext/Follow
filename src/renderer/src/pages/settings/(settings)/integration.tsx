import { SettingIntegration } from "@renderer/modules/settings/tabs/integration"
import { defineSettingPage } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-department-cute-re"
const name = "Integration"
const priority = 1025

export const loader = defineSettingPage({
  iconName,
  name,
  priority,
})

export function Component() {
  return <SettingIntegration />
}
