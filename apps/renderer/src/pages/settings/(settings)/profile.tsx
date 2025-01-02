import { Divider } from "@follow/components/ui/divider/Divider.js"

import { AccountManagement } from "~/modules/profile/account-management"
import { EmailManagement } from "~/modules/profile/email-management"
import { ProfileSettingForm } from "~/modules/profile/profile-setting-form"
import { UpdatePasswordForm } from "~/modules/profile/update-password-form"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"

const iconName = "i-mgc-user-setting-cute-re"
const priority = 1090
export const loader = defineSettingPageData({
  icon: iconName,
  name: "titles.profile",
  priority,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <EmailManagement />
      <ProfileSettingForm />

      <Divider className="mx-auto my-8 w-3/4" />

      <AccountManagement />
      <UpdatePasswordForm />
    </>
  )
}
