import { SettingsTitle } from "../../title"
import { MyWalletSection } from "./my-wallet-section"
import { TransactionsSection } from "./transaction-section"

export const SettingWallet = () => (
  <div className="mt-4 flex grow flex-col">
    <SettingsTitle />

    <MyWalletSection />

    <TransactionsSection />
  </div>
)
