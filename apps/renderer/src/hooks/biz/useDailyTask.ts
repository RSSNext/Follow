import { useClaimCheck, useClaimWalletDailyRewardMutation } from "@renderer/queries/wallet"
import { useEffect } from "react"

export const useDailyTask = () => {
  const { mutateAsync: claimDaily } = useClaimWalletDailyRewardMutation()
  const check = useClaimCheck()

  useEffect(() => {
    if (check.data?.data) {
      claimDaily()
    }
  }, [claimDaily, check.data?.data])
}
