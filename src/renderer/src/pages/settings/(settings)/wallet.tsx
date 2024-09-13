import { SettingWallet } from "@renderer/modules/settings/tabs/wallet"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = `i-mgc-power-outline`
const priority = 1050

export const loader = defineSettingPageData({
  iconName,
  name: "settings:titles.power",
  priority,
  headerIcon: `i-mgc-power text-accent`,
})

export function Component() {
  return <SettingWallet />
}
