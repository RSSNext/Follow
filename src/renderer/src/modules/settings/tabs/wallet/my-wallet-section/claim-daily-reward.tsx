import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { StyledButton } from "@renderer/components/ui/button"
import { Tooltip, TooltipContent } from "@renderer/components/ui/tooltip"
import {
  useClaimWalletDailyRewardMutation,
  useClaimWalletDailyRewardTtl,
} from "@renderer/queries/wallet"
import { useEffect, useState } from "react"

export const ClaimDailyReward = () => {
  const mutation = useClaimWalletDailyRewardMutation()

  const ttl = useClaimWalletDailyRewardTtl()

  const [ttlState, setTtlState] = useState(ttl.data?.data.ttl ?? 0)

  const hour = Math.floor(ttlState / 3600)
    .toString()
    .padStart(2, "0")
  const minute = Math.floor((ttlState % 3600) / 60)
    .toString()
    .padStart(2, "0")

  const canClaim = ttlState <= 0

  // refresh ttl every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTtlState((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // update ttl when ttl changes
  useEffect(() => {
    if (ttl.data?.data.ttl) {
      setTtlState(ttl.data.data.ttl)
    }
  }, [ttl.data?.data.ttl])

  return (
    <Tooltip>
      <TooltipTrigger>
        <StyledButton
          variant="primary"
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate()}
          disabled={!canClaim}
        >
          {canClaim ?
            "Mint Daily Power" :
            `Mint in ${hour}:${minute}`}
        </StyledButton>
      </TooltipTrigger>
      <TooltipContent>
        {canClaim ?
          "Mint your 2 Daily Power now!" :
          `You can mint your Daily Power in ${hour}:${minute}.`}
      </TooltipContent>
    </Tooltip>
  )
}
