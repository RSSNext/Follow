import { SettingWallet } from "@renderer/modules/settings/tabs/wallet"
import { defineSettingPageData } from "@renderer/modules/settings/utils"

const iconName = `i-mgc-power-outline`
const priority = 1040

export const loader = defineSettingPageData({
  iconName,
  name: "titles.power",
  priority,
  headerIcon: `i-mgc-power text-accent`,
})

export function Component() {
  return <SettingWallet />
}
