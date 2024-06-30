import { SettingWallet } from "@renderer/modules/settings/tabs/wallet"
import { defineSettingPage } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-power"
const name = "Power"
const priority = 1050

export const loader = defineSettingPage({
  iconName,
  name,
  priority,
})

export function Component() {
  return <SettingWallet />
}
