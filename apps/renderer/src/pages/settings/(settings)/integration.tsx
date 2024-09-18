import { SettingIntegration } from "~/modules/settings/tabs/integration"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"

const iconName = "i-mgc-department-cute-re"
const priority = 1025

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
