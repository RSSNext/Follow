import { useTranslation } from "react-i18next"

import { MyWalletSection } from "~/modules/settings/tabs/wallet/my-wallet-section"
import { TransactionsSection } from "~/modules/settings/tabs/wallet/transaction-section"

export function Component() {
  const { t } = useTranslation()

  return (
    <div className="max-w-screen-md px-10">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold">
        <i className="i-mgc-power text-accent" />
        {t("words.power")}
      </div>
      <MyWalletSection />
      <TransactionsSection />
    </div>
  )
}
