import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { from, toNumber } from "dnum"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { useModalStack } from "~/components/ui/modal"
import { apiClient } from "~/lib/api-fetch"
import { cn } from "~/lib/utils"
import { Balance } from "~/modules/wallet/balance"
import { useWallet, wallet as walletActions } from "~/queries/wallet"

export const WithdrawButton = () => {
  const { t } = useTranslation("settings")
  const { present } = useModalStack()

  const onClick = () => {
    present({
      title: t("wallet.withdraw.modalTitle"),
      content: ({ dismiss }) => <WithdrawModalContent dismiss={dismiss} />,
    })
  }

  return (
    <Button variant="outline" onClick={onClick}>
      {t("wallet.withdraw.button")}
    </Button>
  )
}

const WithdrawModalContent = ({ dismiss }: { dismiss: () => void }) => {
  const { t } = useTranslation("settings")
  const wallet = useWallet()
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
      toast.error(t("wallet.withdraw.error", { error: mutation.error?.message }))
    }
  }, [mutation.isError, t])

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success(t("wallet.withdraw.success"))
      walletActions.get().invalidate()
      walletActions.transactions.get().invalidate()
      dismiss()
    }
  }, [mutation.isSuccess, t, dismiss])

  return (
    <>
      <div className={cn(!cashablePowerTokenNumber && "text-orange-700", "mb-4 text-sm")}>
        <Trans
          i18nKey="wallet.withdraw.availableBalance"
          components={{
            Balance: (
              <Balance className="inline-block" value={wallet.data?.[0].cashablePowerToken || "0"}>
                {wallet.data?.[0].cashablePowerToken || "0"}
              </Balance>
            ),
          }}
          ns="settings"
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("wallet.withdraw.addressLabel")}</FormLabel>
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
                <FormLabel>{t("wallet.withdraw.amountLabel")}</FormLabel>
                <FormControl>
                  <Input
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
              {t("wallet.withdraw.submitButton")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
