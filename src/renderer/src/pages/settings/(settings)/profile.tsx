import { ProfileSettingForm } from "@renderer/modules/profile/profile-setting-form"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPage } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-user-setting-cute-re"
const name = "settings.profile.sidebar_title"
const priority = 1030
export const loader = defineSettingPage({
  iconName,
  name,
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
