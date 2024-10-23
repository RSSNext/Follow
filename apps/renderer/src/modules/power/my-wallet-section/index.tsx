import { Button } from "@follow/components/ui/button/index.js"
import { Divider } from "@follow/components/ui/divider/index.js"
import { LoadingWithIcon } from "@follow/components/ui/loading/index.jsx"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@follow/components/ui/tooltip/index.jsx"
import { cn } from "@follow/utils/utils"
import { useMutation } from "@tanstack/react-query"
import { Trans, useTranslation } from "react-i18next"

import { useServerConfigs } from "~/atoms/server-configs"
import { CopyButton } from "~/components/ui/code-highlighter"
import { apiClient } from "~/lib/api-fetch"
import { getBlockchainExplorerUrl } from "~/lib/utils"
import { SettingSectionTitle } from "~/modules/settings/section"
import { ActivityPoints } from "~/modules/wallet/activity-points"
import { Balance } from "~/modules/wallet/balance"
import { Level } from "~/modules/wallet/level"
import { useWallet, wallet as walletActions } from "~/queries/wallet"

import { ClaimDailyReward } from "./claim-daily-reward"
import { CreateWallet } from "./create-wallet"
import { useRewardDescriptionModal } from "./reward-description-modal"
import { WithdrawButton } from "./withdraw"

export const MyWalletSection = ({ className }: { className?: string }) => {
  const { t } = useTranslation("settings")
  const wallet = useWallet()
  const myWallet = wallet.data?.[0]
  const serverConfigs = useServerConfigs()

  const rewardDescriptionModal = useRewardDescriptionModal()

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
    <div className={cn(className)}>
      <div className="text-sm">
        <i className="i-mgc-power mr-0.5 size-3.5 translate-y-px text-accent" />
        <Trans
          i18nKey="wallet.power.description2"
          ns="settings"
          values={{ blockchainName: "VSL" }}
          components={{
            Link: (
              <a
                className="underline"
                target="_blank"
                href={`${getBlockchainExplorerUrl()}/token/0xE06Af68F0c9e819513a6CD083EF6848E76C28CD8`}
                rel="noreferrer noopener"
              />
            ),
          }}
        />
      </div>
      <SettingSectionTitle margin="compact" title={t("wallet.address.title")} />
      <div className="group flex items-center gap-2 text-sm">
        <a
          href={`${getBlockchainExplorerUrl()}/address/${myWallet.address}`}
          target="_blank"
          className="underline"
        >
          {myWallet.address}
        </a>
        <CopyButton
          value={myWallet.address!}
          className="p-1 opacity-0 duration-200 group-hover:opacity-100 [&_i]:size-2.5"
        />
      </div>
      <SettingSectionTitle title={t("wallet.balance.title")} margin="compact" />
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <Balance className="text-xl font-bold text-accent">
              {BigInt(myWallet.powerToken || 0n)}
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
          <Tooltip>
            <TooltipTrigger className="mt-1 block">
              <div className="flex flex-row items-center gap-x-2 text-xs">
                <span className="flex items-center gap-1 text-left">
                  {t("wallet.balance.withdrawable")} <i className="i-mgc-question-cute-re" />
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
        <div className="flex gap-2">
          <WithdrawButton />
        </div>
      </div>
      <Divider className="my-8" />
      <SettingSectionTitle title={t("wallet.balance.dailyReward")} margin="compact" />
      {serverConfigs?.DISABLE_PERSONAL_DAILY_POWER && (
        <div className="my-2 text-[15px] leading-tight text-orange-500">
          {t("wallet.power.rewardDescription3")}
        </div>
      )}
      <div className="my-1 text-sm">{t("wallet.power.rewardDescription")}</div>
      <div className="my-1 text-sm">
        <Trans
          i18nKey="wallet.power.rewardDescription2"
          ns="settings"
          values={{ blockchainName: "VSL" }}
          components={{
            Balance: (
              <Balance
                className="align-sub"
                withSuffix
                value={BigInt(myWallet.todayDailyPower || 0n)}
              >
                {BigInt(myWallet.todayDailyPower || 0n)}
              </Balance>
            ),
            Link: <Button onClick={rewardDescriptionModal} variant="text" />,
          }}
        />
      </div>
      <div className="my-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="space-y-1">
            <Level level={myWallet.level?.level || 0} />
            <ActivityPoints points={myWallet.level?.prevActivityPoints || 0} />
          </div>
          <i className="i-mgc-right-cute-li text-3xl" />
          <Balance withSuffix>{BigInt(myWallet.todayDailyPower || 0n)}</Balance>
        </div>
        <ClaimDailyReward />
      </div>
    </div>
  )
}
