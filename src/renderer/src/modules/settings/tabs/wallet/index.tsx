import { Divider } from "@renderer/components/ui/divider"

import { SettingsTitle } from "../../title"
import { MyWalletSection } from "./my-wallet-section"
import { TransactionsSection } from "./transaction-section"

export const SettingWallet = () => (
  <div className="mt-4">
    <SettingsTitle />

    <MyWalletSection />

    <Divider className="my-8" />

    <TransactionsSection />
  </div>
)
