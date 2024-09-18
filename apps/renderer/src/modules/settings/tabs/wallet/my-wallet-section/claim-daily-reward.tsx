import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { Button } from "@renderer/components/ui/button"
import { Tooltip, TooltipContent } from "@renderer/components/ui/tooltip"
import { DAILY_CLAIM_AMOUNT } from "@renderer/constants"
import { useClaimCheck, useClaimWalletDailyRewardMutation } from "@renderer/queries/wallet"
import { Trans, useTranslation } from "react-i18next"

export const ClaimDailyReward = () => {
  const mutation = useClaimWalletDailyRewardMutation()
  const { t } = useTranslation("settings")

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
          {canClaim ? t("wallet.claim.button.claim") : t("wallet.claim.button.claimed")}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {canClaim ? (
          <Trans
            i18nKey="wallet.claim.tooltip.canClaim"
            ns="settings"
            values={{ amount: DAILY_CLAIM_AMOUNT }}
          />
        ) : (
          t("wallet.claim.tooltip.alreadyClaimed")
        )}
      </TooltipContent>
    </Tooltip>
  )
}
