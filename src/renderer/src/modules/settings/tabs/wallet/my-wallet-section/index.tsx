import { useWhoami } from "@renderer/atoms/user"
import { CopyButton } from "@renderer/components/ui/code-highlighter"
import { LoadingWithIcon } from "@renderer/components/ui/loading"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { SettingSectionTitle } from "@renderer/modules/settings/section"
import { Balance } from "@renderer/modules/wallet/balance"
import { useWallet } from "@renderer/queries/wallet"

import { ClaimDailyReward } from "./claim-daily-reward"
import { CreateWallet } from "./create-wallet"
import { WithdrawButton } from "./withdraw"

export const MyWalletSection = () => {
  const user = useWhoami()
  const wallet = useWallet({ userId: user?.id })
  const myWallet = wallet.data?.[0]

  if (wallet.isPending) {
    return (
      <div className="center absolute inset-0 flex">
        <LoadingWithIcon
          icon={<i className="i-mgc-power" />}
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
    <div className="space-y-8">
      <div>
        <div className="text-sm">
          <p>Power is an ERC-20 token on the <a className="underline" target="_blank" href="https://scan.rss3.io/token/0xE06Af68F0c9e819513a6CD083EF6848E76C28CD8">VSL blockchain</a>.</p>
          <p>You can claim 2 free Power daily, which can be used to tip RSS entries on Follow.</p>
        </div>
        <SettingSectionTitle title="Your Address" />
        <div className="flex items-center gap-2 text-sm">
          <a href={`https://scan.rss3.io/address/${myWallet.address}`} target="_blank" className="underline">
            {myWallet.address}
          </a>
          <CopyButton value={myWallet.address!} className="p-1 [&_i]:size-2.5" />
        </div>
        <SettingSectionTitle title="Your Balance" />
        <div className="mb-2 flex items-end justify-between">
          <Balance className="text-xl font-bold text-accent">
            {BigInt(myWallet.dailyPowerToken || 0n) +
            BigInt(myWallet.cashablePowerToken || 0n)}
          </Balance>
          <div className="flex gap-2">
            <WithdrawButton />
            <ClaimDailyReward />
          </div>
        </div>
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
              <p>1. Daily Power can only be used for tipping others.</p>
              <p>2. You mint Daily Power for free once every 24 hours.</p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className="block">
            <div className="flex flex-row items-center gap-x-2 text-xs text-zinc-600 dark:text-neutral-400">
              <span className="flex w-[120px] items-center gap-1 text-left">
                Cashable Power <i className="i-mingcute-question-line" />
              </span>

              <Balance>{myWallet.cashablePowerToken}</Balance>
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent align="start" className="z-[999]">
              <p>
                1. Cashable Power can be withdrawn to your wallet for trading.
              </p>
              <p>
                2. Cashable Power is the Power you have recharged and the tips
                you have received.
              </p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </div>
    </div>
  )
}
