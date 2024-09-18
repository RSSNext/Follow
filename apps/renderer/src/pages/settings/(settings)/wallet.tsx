import { SettingWallet } from "~/modules/settings/tabs/wallet"
import { defineSettingPageData } from "~/modules/settings/utils"

const iconName = `i-mgc-power-outline`
const priority = 1050

export const loader = defineSettingPageData({
  iconName,
  name: "titles.power",
  priority,
  headerIcon: `i-mgc-power text-accent`,
})

export function Component() {
  return <SettingWallet />
}
