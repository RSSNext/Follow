import { from } from "dnum"
import type { FC } from "react"
import { useState } from "react"

import { Button } from "~/components/ui/button"
import { Divider } from "~/components/ui/divider"
import { LoadingWithIcon } from "~/components/ui/loading"
import { useCurrentModal } from "~/components/ui/modal"
import { RadioGroup } from "~/components/ui/radio-group"
import { RadioCard } from "~/components/ui/radio-group/RadioCard"
import { useI18n } from "~/hooks/common"
import { nextFrame } from "~/lib/dom"
import { UserAvatar } from "~/modules/user/UserAvatar"
import { useWallet, useWalletTipMutation } from "~/queries/wallet"

import { useFeedClaimModal } from "../claim"
import { useSettingModal } from "../settings/modal/hooks-hack"
import { Balance } from "./balance"

const DEFAULT_RECOMMENDED_TIP = 10

const useMyWallet = () => {
  const myWallet = useWallet()
  return myWallet
}

const Loading = () => (
  <div className="center h-32 w-[350px]">
    <LoadingWithIcon icon={<i className="i-mgc-power text-accent" />} size="large" />
  </div>
)

export const TipModalContent: FC<{
  userId?: string
  feedId: string
  entryId: string
}> = (props) => {
  const myWallet = useMyWallet()

  if (!myWallet.data) {
    return <Loading />
  }
  return <TipModalContent_ {...props} />
}
const TipModalContent_: FC<{
  userId?: string
  feedId: string
  entryId: string
}> = ({ userId, feedId, entryId }) => {
  const t = useI18n()
  const myWallet = useMyWallet()
  const myWalletData = myWallet.data?.[0]

  const dPowerBigInt = BigInt(myWalletData?.dailyPowerToken ?? 0)
  const cPowerBigInt = BigInt(myWalletData?.cashablePowerToken ?? 0)
  const balanceBigInt = cPowerBigInt + dPowerBigInt

  const tipMutation = useWalletTipMutation()

  const [amount, setAmount] = useState<number>(DEFAULT_RECOMMENDED_TIP)

  const amountBigInt = from(amount, 18)[0]

  const wrongNumberRange = amountBigInt > balanceBigInt || amountBigInt <= BigInt(0)

  const { dismiss } = useCurrentModal()

  const settingModalPresent = useSettingModal()

  const claimFeed = useFeedClaimModal({
    feedId,
  })

  if (myWallet.isPending) {
    return <Loading />
  }

  if (!myWalletData) {
    return (
      <div className="flex w-[80vw] max-w-[350px] flex-col gap-5">
        <p className="text-sm text-theme-foreground/80">{t("tip_modal.no_wallet")}</p>
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => nextFrame(() => settingModalPresent("wallet"))}>
            {t("tip_modal.create_wallet")}
          </Button>
        </div>
      </div>
    )
  }

  if (tipMutation.isSuccess) {
    return (
      <div className="flex w-[80vw] max-w-[350px] flex-col gap-5">
        <p className="text-sm text-theme-foreground/80">{t("tip_modal.tip_sent")}</p>
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
      {userId ? (
        <>
          <p className="text-sm font-medium">{t("tip_modal.feed_owner")}</p>
          <UserAvatar
            className="h-8 justify-start bg-transparent p-0"
            userId={userId}
            enableModal
          />
        </>
      ) : (
        <>
          <p className="leading-none">
            <span className="text-xs text-theme-foreground/80">
              {t("tip_modal.unclaimed_feed")}
            </span>
          </p>
          <div className="text-center">
            <Button variant="text" className="w-fit p-0" onClick={() => claimFeed()}>
              {t("tip_modal.claim_feed")}
            </Button>
          </div>
        </>
      )}
      <Divider className="my-2" />
      <p className="text-sm text-theme-foreground/80">{t("tip_modal.tip_support")}</p>

      <div className="flex flex-col justify-center gap-y-2">
        <div className="flex flex-row items-center gap-x-2 font-bold">
          <i className="i-mgc-power text-accent" />
          <span>{t("tip_modal.amount")}</span>
        </div>

        <RadioGroup value={amount.toString()} onValueChange={(value) => setAmount(Number(value))}>
          <div className="grid grid-cols-2 gap-2">
            <RadioCard
              wrapperClassName="justify-center"
              label={
                <span className="flex items-center gap-1">
                  10 <i className="i-mgc-power text-accent" />
                </span>
              }
              value="10"
            />
            <RadioCard
              wrapperClassName="justify-center group"
              label={
                <span className="flex items-center gap-1">
                  20 <i className="i-mgc-power text-accent" />
                </span>
              }
              value="20"
            />
          </div>
        </RadioGroup>

        {/* low balance notice */}
        {wrongNumberRange && (
          <>
            <Divider className="my-2" />
            <div className="text-xs text-red-500">
              <span>{t("tip_modal.low_balance")}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          disabled={tipMutation.isSuccess || tipMutation.isPending || wrongNumberRange}
          isLoading={tipMutation.isPending}
          onClick={() => {
            if (tipMutation.isPending) return
            tipMutation.mutate({
              entryId,
              amount: amountBigInt.toString() as "1000000000000000000" | "2000000000000000000",
            })
          }}
          variant={tipMutation.isSuccess ? "outline" : "primary"}
        >
          {tipMutation.isSuccess && <i className="i-mgc-check-circle-filled mr-2 bg-green-500" />}
          {t("tip_modal.tip_now")}
        </Button>
      </div>
    </div>
  )
}
