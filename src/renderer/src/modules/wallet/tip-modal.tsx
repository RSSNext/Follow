import { useUser } from "@renderer/atoms/user"
import { StyledButton } from "@renderer/components/ui/button"
import { Divider } from "@renderer/components/ui/divider"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { RadioGroup } from "@renderer/components/ui/radio-group"
import { RadioCard } from "@renderer/components/ui/radio-group/RadioCard"
import { Balance } from "@renderer/components/ui/wallet/balance"
import { nextFrame } from "@renderer/lib/dom"
import { useWallet, useWalletTipMutation, useWalletTransactions } from "@renderer/queries/wallet"
import { from, toNumber } from "dnum"
import type { FC } from "react"
import { useState } from "react"

import { useSettingModal } from "../settings/modal/hooks-hack"

const DEFAULT_RECOMMENDED_TIP = 1

export const TipModalContent: FC<{
  userId?: string
  feedId?: string
}> = ({ userId, feedId }) => {
  const user = useUser()
  const myWallet = useWallet({ userId: user?.id })
  const myWalletData = myWallet.data?.[0]

  const dPowerBigInt = BigInt(myWalletData?.dailyPowerToken ?? 0)
  const cPowerBigInt = BigInt(myWalletData?.cashablePowerToken ?? 0)
  const balanceBigInt = cPowerBigInt + dPowerBigInt
  const balanceNumber = toNumber(from(balanceBigInt, 18), { digits: 2, trailingZeros: true })

  const transactionsQuery = useWalletTransactions({ toUserId: userId, toFeedId: feedId })

  const tipMutation = useWalletTipMutation()

  const [amount, setAmount] = useState(DEFAULT_RECOMMENDED_TIP > balanceNumber ? balanceNumber : DEFAULT_RECOMMENDED_TIP)

  const amountBigInt = from(amount, 18)[0]
  const shouldDeductFromCPower = amountBigInt > dPowerBigInt

  const wrongNumberRange = amountBigInt > balanceBigInt || amountBigInt <= BigInt(0)

  const [showConfirm, setShowConfirm] = useState(false)

  const { dismiss } = useCurrentModal()

  const settingModalPresent = useSettingModal()

  if (transactionsQuery.isPending || myWallet.isPending) {
    return (
      <div className="center h-32 w-[650px]">
        <LoadingCircle size="large" />
      </div>
    )
  }

  if (!myWalletData) {
    return (
      <div className="flex w-[80vw] max-w-[350px] flex-col gap-5">
        <p className="text-sm text-theme-foreground/80">
          You don't have a wallet yet. Please create a wallet to tip.
        </p>
        <div className="flex justify-end">
          <StyledButton
            variant="primary"
            onClick={() => nextFrame(() => settingModalPresent("wallet"))}
          >
            Create For Free
          </StyledButton>
        </div>
      </div>
    )
  }

  // if (transactionsQuery.error) {
  //   return <div>Failed to load transactions history.</div>
  // }

  if (tipMutation.isSuccess) {
    return (
      <div className="flex w-[80vw] max-w-[350px] flex-col gap-5">
        <p className="text-sm text-theme-foreground/80">
          Tip sent successfully! Thank you for your support.
        </p>
        <p>
          <Balance withSuffix>{amountBigInt}</Balance>
          {" "}
          has been sent to the author.
        </p>

        <div className="flex justify-end">
          <StyledButton
            variant="primary"
            onClick={() => dismiss()}
          >
            OK
          </StyledButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-[80vw] max-w-[350px] flex-col gap-5">
      <p className="text-sm text-theme-foreground/80">
        ⭐ Tip to show your support! Your tip will be added to the author's
        wallet.
      </p>

      <div className="flex flex-col justify-center gap-y-2">
        <div className="flex flex-row items-center gap-x-2 font-bold">
          <i className="i-mgc-power" />
          <span>Amount</span>
        </div>

        <RadioGroup
          value={amount.toString()}
          onValueChange={(value) => setAmount(Number(value))}
        >
          <div className="grid grid-cols-2 gap-2">
            <RadioCard wrapperClassName="justify-center" label="1" value="1" />
            <RadioCard wrapperClassName="justify-center" label="2" value="2" />
          </div>
        </RadioGroup>

        <Divider className="my-2" />

        {/* low balance notice */}
        {wrongNumberRange && (
          <div className="text-xs text-red-500">
            <span>
              Your balance is not enough to cover this tip. Please adjust the
              amount.
            </span>
          </div>
        )}

        {/* cPower spent notice */}
        {!wrongNumberRange && shouldDeductFromCPower && (
          <div className="text-xs text-red-500">
            <span>
              Your daily $POWER is not enough to cover this tip. The remaining
              amount will be deducted from your cashable $POWER.
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <StyledButton
          disabled={tipMutation.isSuccess || tipMutation.isPending || wrongNumberRange}
          isLoading={tipMutation.isPending}
          onClick={() => {
            if (tipMutation.isPending) return
            if (!showConfirm) {
              setShowConfirm(true)
              return
            }
            tipMutation.mutate({
              userId,
              feedId,
              amount: amountBigInt.toString(),
            })
            setShowConfirm(false)
          }}
          variant={tipMutation.isSuccess ? "plain" : "primary"}
        >
          {tipMutation.isSuccess && (
            <i className="i-mgc-check-circle-filled mr-2 bg-green-500" />
          )}
          {showConfirm ? (
            <div className="flex flex-row justify-center gap-x-1">
              Confirm Tip
              <Balance withTooltip={false} withSuffix>
                {amountBigInt}
              </Balance>
            </div>
          ) : (
            "Tip Now"
          )}
        </StyledButton>
      </div>
    </div>
  )
}
