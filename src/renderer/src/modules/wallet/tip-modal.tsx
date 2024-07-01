import { useUser } from "@renderer/atoms/user"
import { StyledButton } from "@renderer/components/ui/button"
import { Divider } from "@renderer/components/ui/divider"
import { Input } from "@renderer/components/ui/input"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { RadioGroup, useRadioContext } from "@renderer/components/ui/radio-group"
import { RadioCard } from "@renderer/components/ui/radio-group/RadioCard"
import { Balance } from "@renderer/components/ui/wallet/balance"
import { nextFrame } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { useWallet, useWalletTipMutation, useWalletTransactions } from "@renderer/queries/wallet"
import { from, subtract, toNumber } from "dnum"
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

  const balanceBigInt = BigInt(myWalletData?.powerToken ?? 0)
  const balanceNumber = toNumber(from(balanceBigInt, 18), { digits: 2, trailingZeros: true })

  const transactionsQuery = useWalletTransactions({ toUserId: userId, toFeedId: feedId })

  const tipMutation = useWalletTipMutation()

  const [amount, setAmount] = useState(DEFAULT_RECOMMENDED_TIP > balanceNumber ? balanceNumber : DEFAULT_RECOMMENDED_TIP)
  const [amountCard, setAmountCard] = useState("1")

  const amountBigInt = from(amount, 18)[0]
  const remainingBalance = subtract(balanceBigInt, amountBigInt)[0]

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
        <div className="font-bold">Amount</div>

        <RadioGroup
          value={amountCard}
          onValueChange={(value) => {
            setAmountCard(value)
            if (value === "custom") return
            setAmount(Number(value))
          }}
        >
          <div className="grid grid-cols-3 gap-2">
            <RadioCard className="justify-center" label="1.00" value="1" />
            <RadioCard className="justify-center" label="2.00" value="2" />

            <RadioCard
              wrapperClassName="justify-center p-0"
              label={(
                <CustomBalanceInput
                  max={balanceNumber}
                  value={amount}
                  onChange={(e) => {
                    setAmountCard("custom")
                    setAmount(Number(e.target.value))
                  }}
                  onClick={(e) => {
                    setAmountCard("custom")
                    setAmount(Number(e.target.value))
                  }}
                />
              )}
              value="custom"
            />
          </div>
        </RadioGroup>

        <Divider className="my-2" />

        <div className="text-sm text-theme-foreground/80">
          <div className="flex flex-row gap-x-2">
            <div className="font-bold">Balance</div>
            <Balance withSuffix>{balanceBigInt}</Balance>
          </div>
          <div
            className={cn("flex flex-row gap-x-2", {
              "text-red-500": wrongNumberRange,
            })}
          >
            <div className="font-bold">Tipping</div>
            <Balance withSuffix>{amountBigInt}</Balance>
          </div>
          <div
            className={cn("flex flex-row gap-x-2", {
              "text-red-500": wrongNumberRange,
            })}
          >
            <div className="font-bold">Remaining</div>
            <Balance withSuffix>{remainingBalance}</Balance>
          </div>
        </div>
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

const CustomBalanceInput = ({
  max,
  value,
  onClick,
  onChange,
}: {
  max?: number
  value: number
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const { onChange: ctxOnChange } = useRadioContext()

  return (
    <Input
      key="custom"
      className="focus:border-0"
      type="number"
      min={0}
      max={max}
      step={0.01}
      placeholder="Enter amount"
      value={value}
      onClick={(e) => {
        ctxOnChange?.("custom")
        onClick?.(e)
      }}
      onChange={(e) => {
        onChange?.(e)
      }}
    />
  )
}
