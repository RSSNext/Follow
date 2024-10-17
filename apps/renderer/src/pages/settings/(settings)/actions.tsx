import { UserRole } from "~/lib/enum"
import { ActionSetting } from "~/modules/settings/tabs/actions"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData, DisableWhy } from "~/modules/settings/utils"

const iconName = "i-mgc-magic-2-cute-re"
const priority = 1020

export const loader = defineSettingPageData({
  iconName,
  name: "titles.actions",
  priority,
  disableIf: (ctx) => [ctx.role === UserRole.Trial, DisableWhy.NotActivation],
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <ActionSetting />
    </>
  )
}
