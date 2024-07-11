import { useUser } from "@renderer/atoms/user"
import { Divider } from "@renderer/components/ui/divider"
import { LoadingCircle } from "@renderer/components/ui/loading"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
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
        <div className="center absolute inset-0 flex">
          <LoadingCircle size="large" className="-translate-y-full" />
        </div>
      ) : !myWallet ?
          (
            <CreateWallet />
          ) :
          (
            <div className="space-y-8">
              <div>
                <SettingSectionTitle title="Balance" />
                <div className="flex items-center justify-between">
                  <Balance className="text-xl font-bold text-theme-accent">
                    {BigInt(myWallet.dailyPowerToken || 0n) +
                    BigInt(myWallet.cashablePowerToken || 0n)}
                  </Balance>
                  <ClaimDailyReward />
                </div>
                <Divider className="my-4" />
                <Tooltip>
                  <TooltipTrigger className="block">
                    <div className="flex flex-row items-center gap-x-2 text-xs text-zinc-600 dark:text-neutral-400">
                      <span className="flex w-[120px] items-center gap-1 text-left">
                        Daily Power
                        <i className="i-mingcute-question-line" />
                      </span>
                      <Balance>{myWallet.dailyPowerToken}</Balance>

                    </div>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent align="start" className="z-[999]">
                      <p>1. Daily Power can only be used for tips.</p>
                      <p>
                        2. It comes from the Power you claim for free every day..
                      </p>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="block">
                    <div className="flex flex-row items-center gap-x-2 text-xs text-zinc-600 dark:text-neutral-400">
                      <span className="flex w-[120px] items-center gap-1 text-left">
                        Cashable Power
                        {" "}
                        <i className="i-mingcute-question-line" />
                      </span>

                      <Balance>{myWallet.cashablePowerToken}</Balance>
                    </div>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent align="start" className="z-[999]">
                      <p>
                        1. You can transfer Cashable Power to your wallet and trade
                        freely.
                      </p>
                      <p>
                        2. It comes from the Power you recharge and the tips you
                        receive.
                      </p>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </div>
            </div>
          )}
    </div>
  )
}
