import { useTranslation } from "react-i18next"

import { Divider } from "~/components/ui/divider"
import { MyWalletSection } from "~/modules/power/my-wallet-section"
import { TransactionsSection } from "~/modules/power/transaction-section"

export function Component() {
  const { t } = useTranslation()

  return (
    <div className="w-[768px] px-10">
      <div className="mb-8 flex items-center gap-2 text-3xl font-bold">
        <div className="motion-preset-shake center text-accent motion-delay-500">
          <i className="i-mgc-power" />
        </div>
        {t("words.power")}
      </div>
      <MyWalletSection />
      <Divider className="my-8" />
      <TransactionsSection />
    </div>
  )
}
