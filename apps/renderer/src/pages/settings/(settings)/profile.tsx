import { ProfileSettingForm } from "@renderer/modules/profile/profile-setting-form"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-user-setting-cute-re"
const priority = 1030
export const loader = defineSettingPageData({
  iconName,
  name: "titles.profile",
  priority,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <ProfileSettingForm />
    </>
  )
}
