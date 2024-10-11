import { UserRole } from "~/lib/enum"
import { SettingInvitations } from "~/modules/settings/tabs/invitations"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"

const iconName = "i-mgc-love-cute-re"
const priority = 1070

export const loader = defineSettingPageData({
  iconName,
  name: "titles.invitations",
  priority,
  hideIf: (ctx) => ctx.role === UserRole.Trial,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <SettingInvitations />
    </>
  )
}
