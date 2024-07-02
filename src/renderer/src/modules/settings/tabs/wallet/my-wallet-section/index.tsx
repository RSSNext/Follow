import { useUser } from "@renderer/atoms/user"
import { Divider } from "@renderer/components/ui/divider"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip"
import { Balance } from "@renderer/components/ui/wallet/balance"
import { SettingSectionTitle } from "@renderer/modules/settings/section"
import { useWallet } from "@renderer/queries/wallet"

import { ClaimDailyReward } from "./claim-daily-reward"
import { CreateWallet } from "./create-wallet"

export const MyWalletSection = () => {
  const user = useUser()
  const wallet = useWallet({ userId: user?.id })
  const myWallet = wallet.data?.[0]

  return (
    <div>
      {wallet.isPending ? (
        <LoadingCircle size="large" />
      ) : !myWallet ?
          (
            <CreateWallet />
          ) :
          (
            <div className="space-y-8">
              <div>
                <SettingSectionTitle title="Balance" />
                <div className="flex items-center justify-between">
                  <Balance className="text-xl font-bold text-theme-accent">{myWallet.dailyPowerToken}</Balance>
                  <ClaimDailyReward />
                </div>
                <Divider className="my-4" />
                <Tooltip>
                  <TooltipTrigger className="block">
                    <div className="flex flex-row items-center gap-x-2 text-xs text-zinc-600 dark:text-neutral-400">
                      <span className="">Daily Power</span>
                      <Balance>{myWallet.dailyPowerToken}</Balance>
                      <i className="i-mingcute-question-line" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>1. Daily Power can only be used for tips.</p>
                    <p>2. It comes from the Power you claim for free every day..</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="block">
                    <div className="flex flex-row items-center gap-x-2 text-xs text-zinc-600 dark:text-neutral-400">
                      Cashable Power
                      <Balance>{myWallet.cashablePowerToken}</Balance>
                      <i className="i-mingcute-question-line" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>1. You can transfer Cashable Power to your wallet and trade freely.</p>
                    <p>2. It comes from the Power you recharge and the tips you receive.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
    </div>
  )
}
