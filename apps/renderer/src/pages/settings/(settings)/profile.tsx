import { ProfileSettingForm } from "~/modules/profile/profile-setting-form"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"

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
