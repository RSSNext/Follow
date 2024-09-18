import { SettingFeeds } from "@renderer/modules/settings/tabs/feeds"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-certificate-cute-re"
const priority = 1060

export const loader = defineSettingPageData({
  iconName,
  name: "titles.feeds",
  priority,
})

export function Component() {
  return (
    <>
      <SettingsTitle />
      <SettingFeeds />
    </>
  )
}
