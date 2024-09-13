import { zodResolver } from "@hookform/resolvers/zod"
import { useWhoami } from "@renderer/atoms/user"
import { Button } from "@renderer/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { useModalStack } from "@renderer/components/ui/modal"
import { apiClient } from "@renderer/lib/api-fetch"
import { cn } from "@renderer/lib/utils"
import { Balance } from "@renderer/modules/wallet/balance"
import { useWallet, wallet as walletActions } from "@renderer/queries/wallet"
import { useMutation } from "@tanstack/react-query"
import { from, toNumber } from "dnum"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export const WithdrawButton = () => {
  const { present } = useModalStack()

  const onClick = () => {
    present({
      title: "Withdraw Power",
      content: ({ dismiss }) => <WithdrawModalContent dismiss={dismiss} />,
    })
  }

  return (
    <Button variant="outline" onClick={onClick}>
      Withdraw
    </Button>
  )
}

const WithdrawModalContent = ({ dismiss }: { dismiss: () => void }) => {
  const user = useWhoami()
  const wallet = useWallet({ userId: user?.id })
  const cashablePowerTokenBigInt = [BigInt(wallet.data?.[0].cashablePowerToken || 0n), 18] as const
  const cashablePowerTokenNumber = toNumber(cashablePowerTokenBigInt)

  const formSchema = z.object({
    address: z.string().startsWith("0x").length(42),
    amount: z.number().min(0).max(cashablePowerTokenNumber),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: async ({ address, amount }: { address: string; amount: number }) => {
      const amountBigInt = from(amount, 18)[0]
      await apiClient.wallets.transactions.withdraw.$post({
        json: {
          address,
          amount: amountBigInt.toString(),
        },
      })
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values)
  }

  useEffect(() => {
    if (mutation.isError) {
      toast.error(`Withdrawal failed: ${mutation.error?.message}`)
    }
  }, [mutation.isError])

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success("Withdrawal successful!")
      walletActions.get().invalidate()
      walletActions.transactions.get().invalidate()
      dismiss()
    }
  }, [mutation.isSuccess])

  return (
    <>
      <div className={cn(!cashablePowerTokenNumber && "text-orange-700", "mb-4 text-sm")}>
        You have{" "}
        <Balance className="inline-block">{wallet.data?.[0].cashablePowerToken || "0"}</Balance>{" "}
        withdrawable Power in your wallet.
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Ethereum Address</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} placeholder="0x..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    {...field}
                    type="number"
                    onChange={(value) => field.onChange(value.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="center flex">
            <Button disabled={!form.formState.isValid} type="submit" isLoading={mutation.isPending}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
