import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { Button } from "@renderer/components/ui/button"
import { Tooltip, TooltipContent } from "@renderer/components/ui/tooltip"
import { useClaimCheck, useClaimWalletDailyRewardMutation } from "@renderer/queries/wallet"

export const ClaimDailyReward = () => {
  const mutation = useClaimWalletDailyRewardMutation()

  const check = useClaimCheck()
  const canClaim = check.data?.data

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="primary"
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate()}
          disabled={!canClaim}
        >
          {canClaim ? "Claim Daily Power" : "Claimed today"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {canClaim ? "Claim your 2 Daily Power now!" : `You have already claimed today.`}
      </TooltipContent>
    </Tooltip>
  )
}
