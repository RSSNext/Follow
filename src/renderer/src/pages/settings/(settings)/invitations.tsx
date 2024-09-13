import { SettingInvitations } from "@renderer/modules/settings/tabs/invitations"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-heart-hand-cute-re"

const priority = 1055

export const loader = defineSettingPageData({
  iconName,
  name: "settings.titles.invitations",
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
