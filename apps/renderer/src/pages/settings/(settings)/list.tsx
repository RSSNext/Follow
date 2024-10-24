import { UserRole } from "@follow/constants"

import { SettingLists } from "~/modules/settings/tabs/lists"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData, DisableWhy } from "~/modules/settings/utils"

const iconName = "i-mgc-rada-cute-re"
const priority = 1050

export const loader = defineSettingPageData({
  iconName,
  name: "titles.lists",
  priority,
  disableIf: (ctx) => [ctx.role === UserRole.Trial, DisableWhy.NotActivation],
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <SettingLists />
    </>
  )
}
