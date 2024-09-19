import { useEffect } from "react"

import { useClaimCheck, useClaimWalletDailyRewardMutation } from "~/queries/wallet"

export const useDailyTask = () => {
  const { mutateAsync: claimDaily } = useClaimWalletDailyRewardMutation()
  const check = useClaimCheck()

  useEffect(() => {
    if (check.data?.data) {
      claimDaily()
    }
  }, [claimDaily, check.data?.data])
}
