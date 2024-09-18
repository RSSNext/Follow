import { SettingLists } from "@renderer/modules/settings/tabs/lists"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-rada-cute-re"
const priority = 1050

export const loader = defineSettingPageData({
  iconName,
  name: "titles.lists",
  priority,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <SettingLists />
    </>
  )
}
