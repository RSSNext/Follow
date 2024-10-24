import { Divider } from "@follow/components/ui/divider/index.js"
import { useTranslation } from "react-i18next"

import { MyWalletSection } from "~/modules/power/my-wallet-section"
import { PowerRanking } from "~/modules/power/ranking"
import { TransactionsSection } from "~/modules/power/transaction-section"

import { useSubViewTitle } from "../hooks"

export function Component() {
  const { t } = useTranslation()
  useSubViewTitle(
    <div className="flex items-center gap-2">
      <i className="i-mgc-power size-4 text-accent" />
      {t("words.power")}
    </div>,
    t("words.power"),
  )
  return (
    <div className="w-[768px] px-10">
      <div className="center mb-8 flex h-24 items-center gap-2 text-3xl font-bold">
        <div className="motion-preset-shake center text-accent motion-delay-500">
          <i className="i-mgc-power size-20" />
        </div>
      </div>
      <MyWalletSection />

      <Divider className="my-8" />
      <PowerRanking />

      <Divider className="my-8" />
      <TransactionsSection />
    </div>
  )
}
