import type { WalletModel } from "@follow/models"

import { Balance } from "../wallet/balance"

export function PowerButton({
  isLoading,
  myWallet,
}: {
  isLoading: boolean
  myWallet?: WalletModel
}) {
  return (
    <div className="flex items-center gap-1">
      <i className="i-mgc-power text-accent" />
      {isLoading ? (
        <span className="bg-theme-inactive h-3 w-8 animate-pulse rounded-xl" />
      ) : (
        <Balance precision={0}>{BigInt(myWallet?.powerToken || 0n)}</Balance>
      )}
    </div>
  )
}
