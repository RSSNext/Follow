import { Divider } from "@follow/components/ui/divider/Divider.js"

import { AccountManagement } from "~/modules/profile/account-management"
import { EmailManagement } from "~/modules/profile/email-management"
import { ProfileSettingForm } from "~/modules/profile/profile-setting-form"
import { TwoFactor } from "~/modules/profile/two-factor"
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
      <section className="mt-4">
        <EmailManagement />
        <ProfileSettingForm />

        <Divider className="mb-6 mt-8" />

        <div className="space-y-4">
          <AccountManagement />
          <UpdatePasswordForm />
          <TwoFactor />
        </div>
      </section>
    </>
  )
}
