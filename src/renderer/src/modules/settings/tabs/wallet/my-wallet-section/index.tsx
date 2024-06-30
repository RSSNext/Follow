import { useUser } from "@renderer/atoms/user"
import { LoadingCircle } from "@renderer/components/ui/loading"
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
            <div className="flex flex-row items-center gap-x-5">
              <div className="font-bold">Balance</div>
              <Balance withSuffix>{myWallet.powerToken}</Balance>
              <ClaimDailyReward />
            </div>
          )}
    </div>
  )
}
