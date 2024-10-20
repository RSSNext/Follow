import { from } from "dnum"
import { useCallback, useState } from "react"

import { Button } from "~/components/ui/button"
import { LoadingWithIcon } from "~/components/ui/loading"
import { useCurrentModal } from "~/components/ui/modal"
import { useAuthQuery, useI18n } from "~/hooks/common"
import { boosts, useBoostFeedMutation } from "~/queries/boosts"
import { useWallet } from "~/queries/wallet"

import { Balance } from "../wallet/balance"
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
        <LoadingWithIcon icon={<i className="i-mgc-trophy-cute-re" />} size="large" />
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
          Boost feed to get more privilege, everyone subscribed to this feed will thank you.
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
        variant={boostFeedMutation.isSuccess ? "outline" : "primary"}
        onClick={handleBoost}
      >
        {boostFeedMutation.isSuccess && (
          <i className="i-mgc-check-circle-filled mr-2 bg-green-500" />
        )}
        Boost
      </Button>
    </div>
  )
}

const BoostProgress = ({
  level,
  boostCount,
  remainingBoostsToLevelUp,
}: {
  level: number
  boostCount: number
  remainingBoostsToLevelUp: number
}) => {
  const percentage = (boostCount / (boostCount + remainingBoostsToLevelUp)) * 100
  const nextLevel = level + 1
  return (
    <div className="flex w-full flex-col px-2">
      <div className="relative w-full pt-12">
        <span
          className="absolute bottom-0 mb-10 flex h-8 w-12 -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-sm font-bold text-gray-800 shadow-[0px_12px_30px_0px_rgba(16,24,40,0.1)] transition-all duration-500 ease-out after:absolute after:bottom-[-5px] after:left-1/2 after:-z-10 after:flex after:size-3 after:-translate-x-1/2 after:rotate-45 after:bg-white"
          style={{ left: `${percentage}%` }}
        >
          ⚡️ {boostCount}
        </span>
        <div className="relative flex h-6 w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
          <div
            role="progressbar"
            aria-valuenow={boostCount}
            aria-valuemin={0}
            aria-valuemax={remainingBoostsToLevelUp}
            style={{ width: `${percentage}%` }}
            className="flex h-full items-center justify-center rounded-3xl bg-accent text-white transition-all duration-500 ease-out"
          />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-bold text-accent">Lv. {level}</span>
        <span className="text-lg font-bold text-accent">Lv. {nextLevel}</span>
      </div>
      <small className="center mt-1 gap-1">
        {remainingBoostsToLevelUp} more boost will unlock the next level of privilege.
      </small>
    </div>
  )
}
