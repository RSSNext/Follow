import { useMutation } from "@tanstack/react-query"
import { Trans, useTranslation } from "react-i18next"

import { useWhoami } from "~/atoms/user"
import { Button } from "~/components/ui/button"
import { CopyButton } from "~/components/ui/code-highlighter"
import { LoadingWithIcon } from "~/components/ui/loading"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { DAILY_CLAIM_AMOUNT } from "~/constants"
import { apiClient } from "~/lib/api-fetch"
import { cn } from "~/lib/utils"
import { SettingSectionTitle } from "~/modules/settings/section"
import { Balance } from "~/modules/wallet/balance"
import { useWallet, wallet as walletActions } from "~/queries/wallet"

import { ClaimDailyReward } from "./claim-daily-reward"
import { CreateWallet } from "./create-wallet"
import { WithdrawButton } from "./withdraw"

export const MyWalletSection = () => {
  const { t } = useTranslation("settings")
  const user = useWhoami()
  const wallet = useWallet({ userId: user?.id })
  const myWallet = wallet.data?.[0]

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await apiClient.wallets.refresh.$post()
    },
    onSuccess: () => {
      walletActions.get().invalidate()
    },
  })

  if (wallet.isPending) {
    return (
      <div className="center absolute inset-0 flex">
        <LoadingWithIcon
          icon={<i className="i-mgc-power text-accent" />}
          size="large"
          className="-translate-y-full"
        />
      </div>
    )
  }

  if (!myWallet) {
    return <CreateWallet />
  }
  return (
    <>
      <div className="space-y-8">
        <div>
          <div className="text-sm">
            <Trans
              i18nKey="wallet.power.description"
              ns="settings"
              values={{ blockchainName: "VSL" }}
              components={{
                Link: (
                  <a
                    className="underline"
                    target="_blank"
                    href="https://scan.rss3.io/token/0xE06Af68F0c9e819513a6CD083EF6848E76C28CD8"
                    rel="noreferrer noopener"
                  />
                ),
              }}
            />
            <p>{t("wallet.power.dailyClaim", { amount: DAILY_CLAIM_AMOUNT })}</p>
          </div>
          <SettingSectionTitle margin="compact" title={t("wallet.address.title")} />
          <div className="flex items-center gap-2 text-sm">
            <a
              href={`https://scan.rss3.io/address/${myWallet.address}`}
              target="_blank"
              className="underline"
            >
              {myWallet.address}
            </a>
            <CopyButton value={myWallet.address!} className="p-1 [&_i]:size-2.5" />
          </div>
          <SettingSectionTitle title={t("wallet.balance.title")} margin="compact" />
          <div className="mb-2 flex items-end justify-between">
            <div className="flex items-center gap-1">
              <Balance className="text-xl font-bold text-accent">
                {BigInt(myWallet.dailyPowerToken || 0n) + BigInt(myWallet.cashablePowerToken || 0n)}
              </Balance>
              <Button
                variant="ghost"
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
              >
                <i
                  className={cn(
                    "i-mgc-refresh-2-cute-re",
                    refreshMutation.isPending && "animate-spin",
                  )}
                />
              </Button>
            </div>
            <div className="flex gap-2">
              <WithdrawButton />
              <ClaimDailyReward />
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger className="block">
              <div className="flex flex-row items-center gap-x-2 text-xs text-zinc-600 dark:text-neutral-400">
                <span className="flex items-center gap-1 text-left">
                  {t("wallet.balance.withdrawable")} <i className="i-mingcute-question-line" />
                </span>

                <Balance className="center text-[12px] font-medium">
                  {myWallet.cashablePowerToken}
                </Balance>
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent align="start" className="z-[999]">
                <p>{t("wallet.balance.withdrawableTooltip")}</p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </div>
      </div>
    </>
  )
}
