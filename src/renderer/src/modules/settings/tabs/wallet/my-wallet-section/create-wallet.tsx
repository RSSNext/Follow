import { Button } from "@renderer/components/ui/button"
import { useCreateWalletMutation } from "@renderer/queries/wallet"

export const CreateWallet = () => {
  const mutation = useCreateWalletMutation()

  return (
    <div>
      <p className="text-base">
        Create a free wallet to receive
        {" "}
        <strong className="inline-flex items-baseline gap-1 font-medium">
          <i className="i-mgc-power translate-y-[2px]" />
          Power
        </strong>
        , which can be used to
        reward creators and also get rewarded for your content contributions.
      </p>
      <div className="mt-4 text-right">
        <Button
          variant="primary"
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          Create Wallet
        </Button>
      </div>
    </div>
  )
}
