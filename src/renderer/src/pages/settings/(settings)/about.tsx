import { SettingAbout } from "@renderer/modules/settings/tabs/about"
import { defineSettingPage } from "@renderer/modules/settings/utils"

export const loader = defineSettingPage({
  iconName: "i-mgc-information-cute-re",
  name: "About",
  priority: 9999,
})
export const Component = () => <SettingAbout />
