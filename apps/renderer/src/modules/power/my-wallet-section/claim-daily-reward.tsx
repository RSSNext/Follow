import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { Trans, useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { Tooltip, TooltipContent } from "~/components/ui/tooltip"
import { DAILY_CLAIM_AMOUNT } from "~/constants"
import { Level } from "~/modules/wallet/level"
import { useClaimCheck, useClaimWalletDailyRewardMutation } from "~/queries/wallet"

export const ClaimDailyReward = ({ level }: { level: number }) => {
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
          <Level className="ml-3" level={level} hideIcon />
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
