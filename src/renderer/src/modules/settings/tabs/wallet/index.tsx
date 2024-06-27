import { SettingsTitle } from "../../title"
import { MyWalletSection } from "./my-wallet-section"
import { TransactionsSection } from "./transaction-section"

export const SettingWallet = () => (
  <div>
    <SettingsTitle />

    <MyWalletSection />

    <TransactionsSection />
  </div>
)
