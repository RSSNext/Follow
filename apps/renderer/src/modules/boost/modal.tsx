import { from } from "dnum"
import { useCallback, useState } from "react"

import { Button } from "~/components/ui/button"
import { LoadingWithIcon } from "~/components/ui/loading"
import { useCurrentModal } from "~/components/ui/modal"
import { useAuthQuery, useI18n } from "~/hooks/common"
import { boosts, useBoostFeedMutation } from "~/queries/boosts"
import { useWallet } from "~/queries/wallet"

import { Balance } from "../wallet/balance"
import { BoostProgress } from "./boost-progress"
import { LevelBenefits } from "./level-benefits"
import { RadioCards } from "./radio-cards"

export const BoostModalContent = ({ feedId }: { feedId: string }) => {
  const t = useI18n()
  const myWallet = useWallet()
  const myWalletData = myWallet.data?.[0]

  const dPowerBigInt = BigInt(myWalletData?.dailyPowerToken ?? 0)
  const cPowerBigInt = BigInt(myWalletData?.cashablePowerToken ?? 0)
  const balanceBigInt = cPowerBigInt + dPowerBigInt
  const [amount, setAmount] = useState<number>(0)
  const amountBigInt = from(amount, 18)[0]
  const wrongNumberRange = amountBigInt > balanceBigInt || amountBigInt <= BigInt(0)

  const { data: boostStatus, isLoading } = useAuthQuery(boosts.getStatus({ feedId }))
  const boostFeedMutation = useBoostFeedMutation()
  const { dismiss } = useCurrentModal()

  const handleBoost = useCallback(() => {
    if (boostFeedMutation.isPending) return
    boostFeedMutation.mutate({ feedId, amount: amountBigInt.toString() })
  }, [amountBigInt, boostFeedMutation, feedId])

  if (isLoading || !boostStatus) {
    return (
      <div className="center pointer-events-none grow -translate-y-16">
        <LoadingWithIcon icon={<i className="i-mgc-rocket-cute-fi" />} size="large" />
      </div>
    )
  }

  if (boostFeedMutation.isSuccess) {
    return (
      <div className="flex w-[80vw] max-w-[350px] flex-col gap-5">
        <p className="text-sm text-theme-foreground/80">{t("tip_modal.tip_sent")}</p>
        <BoostProgress {...boostStatus} />
        <p>
          <Balance className="mr-1 inline-block text-sm" withSuffix>
            {amountBigInt}
          </Balance>{" "}
          {t("tip_modal.tip_amount_sent")}
        </p>

        <div className="flex justify-end">
          <Button variant="primary" onClick={() => dismiss()}>
            {t.common("ok")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-[80vw] max-w-[350px] flex-col gap-3">
      <div className="relative flex w-full grow flex-col items-center gap-3">
        <div className="mt-4 text-xl font-bold">🚀 Boost Feed</div>

        <small className="center mt-1 gap-1 text-theme-vibrancyFg">
          Enhance feed to unlock additional benefits, and those who subscribe will be grateful for
          the benefits!
        </small>

        <BoostProgress {...boostStatus} />
        <RadioCards
          monthlyBoostCost={boostStatus.monthlyBoostCost}
          value={amount}
          onValueChange={setAmount}
        />
      </div>

      <Button
        disabled={boostFeedMutation.isSuccess || boostFeedMutation.isPending || wrongNumberRange}
        isLoading={boostFeedMutation.isPending}
        variant="primary"
        onClick={handleBoost}
      >
        <i className="i-mgc-rocket-cute-fi mr-2 shrink-0" />
        Boost
      </Button>

      <LevelBenefits />
    </div>
  )
}
