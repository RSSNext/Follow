import { StyledButton } from "@renderer/components/ui/button"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useWalletTipMutation, useWalletTransactions } from "@renderer/queries/wallet"
import type { FC } from "react"

export const TipModalContent: FC<{
  userId: string
  feedId?: string
}> = ({ userId, feedId }) => {
  const transationsQuery = useWalletTransactions({ toUserId: userId, toFeedId: feedId })

  const tipMutation = useWalletTipMutation()

  if (transationsQuery.isPending) {
    return (
      <div className="center h-32 w-[650px]">
        <LoadingCircle size="large" />
      </div>
    )
  }

  if (transationsQuery.error) {
    return <div>Failed to load transactions history.</div>
  }

  return (
    <div className="w-[650px] max-w-full">
      {/* // TODO: */}
      <div className="mt-3 flex justify-end">
        <StyledButton
          disabled={tipMutation.isSuccess || tipMutation.isPending}
          isLoading={tipMutation.isPending}
          onClick={() => tipMutation.mutate({ userId, feedId, amount: "0" })}
          variant={tipMutation.isSuccess ? "plain" : "primary"}
        >
          {tipMutation.isSuccess && (
            <i className="i-mgc-check-circle-filled mr-2 bg-green-500" />
          )}
          Claim
        </StyledButton>
      </div>
    </div>
  )
}
