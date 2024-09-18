import { SettingInvitations } from "~/modules/settings/tabs/invitations"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"

const iconName = "i-mgc-heart-hand-cute-re"
const priority = 1055

export const loader = defineSettingPageData({
  iconName,
  name: "titles.invitations",
  priority,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <SettingInvitations />
    </>
  )
}
