
import { SettingsTitle } from "../../title"
import { MyWalletSection } from "./my-wallet-section"
import { TransactionsSection } from "./transaction-section"

export const SettingWallet = () => (
  <div className="mt-4">
    <SettingsTitle />

    <MyWalletSection />

    <TransactionsSection />
  </div>
)
