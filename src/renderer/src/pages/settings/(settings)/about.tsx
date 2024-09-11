import { SettingAbout } from "@renderer/modules/settings/tabs/about"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

export const loader = defineSettingPageData({
  iconName: "i-mgc-information-cute-re",
  name: "settings.titles.about",
  priority: 9999,
})
export const Component = () => <SettingAbout />
