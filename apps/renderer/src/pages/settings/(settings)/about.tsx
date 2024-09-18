import { SettingAbout } from "~/modules/settings/tabs/about"
import { defineSettingPageData } from "~/modules/settings/utils"

export const loader = defineSettingPageData({
  iconName: "i-mgc-information-cute-re",
  name: "titles.about",
  priority: 9999,
})
export const Component = () => <SettingAbout />
