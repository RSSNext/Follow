import { SettingInvitations } from "@renderer/modules/settings/tabs/invitations"
import { defineSettingPage } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-heart-hand-cute-re"
const name = "settings.invitation.sidebar_title"
const priority = 1055

export const loader = defineSettingPage({
  iconName,
  name,
  priority,
})

export function Component() {
  return <SettingInvitations />
}
