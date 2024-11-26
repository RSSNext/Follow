import { Button } from "@follow/components/ui/button/index.js"
import { LoadingWithIcon } from "@follow/components/ui/loading/index.jsx"
import { from } from "dnum"
import { AnimatePresence, m } from "framer-motion"
import { useCallback, useState } from "react"

import { softSpringPreset } from "~/components/ui/constants/spring"
import { useCurrentModal } from "~/components/ui/modal/stacked/hooks"
import { useI18n } from "~/hooks/common"
import { useBoostFeedMutation, useBoostStatusQuery } from "~/modules/boost/query"
import { useWallet } from "~/queries/wallet"
import { useFeedById } from "~/store/feed"
import { feedIconSelector } from "~/store/feed/selector"

import { FeedIcon } from "../feed/feed-icon"
import { BoostProgress } from "./boost-progress"
import { BoostingContributors } from "./boosting-contributors"
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

  const { data: boostStatus, isLoading } = useBoostStatusQuery(feedId)
  const boostFeedMutation = useBoostFeedMutation()
  const { dismiss } = useCurrentModal()

  const handleBoost = useCallback(() => {
    if (boostFeedMutation.isPending) return
    boostFeedMutation.mutate({ feedId, amount: amountBigInt.toString() })
  }, [amountBigInt, boostFeedMutation, feedId])

  const feed = useFeedById(feedId, feedIconSelector)

  if (isLoading || !boostStatus) {
    return (
      <div className="center pointer-events-none grow -translate-y-16">
        <LoadingWithIcon icon={<i className="i-mgc-rocket-cute-fi" />} size="large" />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-3 lg:w-[80vw] lg:max-w-[350px]">
      <div className="center flex flex-col gap-2">
        <FeedIcon noMargin feed={feed} size={50} />

        <h1 className="center mt-2 flex flex-wrap text-lg font-bold">
          <div className="center flex shrink-0">
            <i className="i-mgc-rocket-cute-fi mr-1.5 shrink-0 text-lg" />
            {t("boost.boost_feed")}
          </div>
          <span>「{feed?.title}」</span>
        </h1>
      </div>
      <div className="relative flex w-full grow flex-col items-center gap-3">
        <small className="center -mt-1 mb-2 gap-1 text-theme-vibrancyFg">
          {t("boost.boost_feed_description")}
        </small>

        <BoostProgress {...boostStatus} />

        <AnimatePresence>
          {!boostFeedMutation.isSuccess && (
            <RadioCards
              monthlyBoostCost={boostStatus.monthlyBoostCost}
              value={amount}
              onValueChange={setAmount}
            />
          )}
        </AnimatePresence>
      </div>

      {boostFeedMutation.isSuccess ? (
        <>
          <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={softSpringPreset}>
            {t("boost.boost_success_thanks")}
          </m.p>
          <Button variant="primary" onClick={() => dismiss()}>
            {t.common("close")}
          </Button>
        </>
      ) : (
        <Button
          disabled={boostFeedMutation.isSuccess || boostFeedMutation.isPending || wrongNumberRange}
          isLoading={boostFeedMutation.isPending}
          variant="primary"
          onClick={handleBoost}
        >
          <i className="i-mgc-rocket-cute-fi mr-2 shrink-0" />
          {t("words.boost")}
        </Button>
      )}

      <BoostingContributors feedId={feedId} />
      <LevelBenefits />
    </div>
  )
}
