import { SettingIntegration } from "@renderer/modules/settings/tabs/integration"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-department-cute-re"
const priority = 1030

export const loader = defineSettingPageData({
  iconName,
  name: "titles.integration",
  priority,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <SettingIntegration />
    </>
  )
}
