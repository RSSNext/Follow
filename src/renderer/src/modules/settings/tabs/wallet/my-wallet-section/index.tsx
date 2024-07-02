import { useUser } from "@renderer/atoms/user"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip"
import { Balance } from "@renderer/components/ui/wallet/balance"
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
            <div>
              <div className="my-2 flex flex-row items-center gap-x-5">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-row items-center gap-x-2 font-bold">
                      Daily $POWER
                      <i className="i-mingcute-question-line" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Daily $POWER is the amount of $POWER you can claim daily. It can
                    only be used to tip other users.
                  </TooltipContent>
                </Tooltip>
                <Balance>{myWallet.dailyPowerToken}</Balance>
                <ClaimDailyReward />
              </div>

              <div className="my-2 flex flex-row items-center gap-x-5">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-row items-center gap-x-2 font-bold">
                      Cashable $POWER
                      <i className="i-mingcute-question-line" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Cashable $POWER is the amount of $POWER you can withdraw to your
                    wallet. It can be used to tip other users or convert to other
                    cryptocurrencies. When you are tipped with $POWER, it will be
                    added to your cashable $POWER.
                  </TooltipContent>
                </Tooltip>
                <Balance>{myWallet.cashablePowerToken}</Balance>
              </div>
            </div>
          )}
    </div>
  )
}
