import { getStorageNS } from "@renderer/lib/ns"
import { useClaimWalletDailyRewardMutation } from "@renderer/queries/wallet"
import { useEffect } from "react"

const CLAIM_DAILY_KEY = getStorageNS("claimDaily")
export const useDailyTask = () => {
  const { mutateAsync: claimDaily } = useClaimWalletDailyRewardMutation()

  useEffect(() => {
    const today = new Date().toDateString()

    if (localStorage.getItem(CLAIM_DAILY_KEY) === today) return
    claimDaily().finally(() => {
      localStorage.setItem(CLAIM_DAILY_KEY, today)
    })
  }, [claimDaily])
}
