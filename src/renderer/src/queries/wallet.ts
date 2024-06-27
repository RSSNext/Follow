import { useBizQuery } from "@renderer/hooks"
import { apiClient, getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const wallet = {
  get: ({ userId }: { userId?: string } = {}) =>
    defineQuery(
      ["wallet", userId].filter(Boolean),
      async () => {
        const res = await apiClient.wallets.$get({
          query: { userId },
        })

        return res.data
      },
      {
        rootKey: ["wallet"],
      },
    ),

  claimDailyRewardTtl: () =>
    defineQuery(["wallet", "claimDailyRewardTtl"], async () =>
      apiClient.wallets.transactions.claim_daily_ttl.$get()),

  transactions: {
    get: (query: Parameters<typeof apiClient.wallets.transactions.$get>[0]["query"] = {}) =>
      defineQuery(
        ["wallet", "transactions", query].filter(Boolean),
        async () => {
          const res = await apiClient.wallets.transactions.$get({ query })

          return res.data
        },
        {
          rootKey: ["wallet", "transactions"],
        },
      ),
  },
}

export const useWallet = ({ userId }: { userId?: string } = {}) =>
  useBizQuery(
    wallet.get({ userId }),
    { enabled: !!userId },
  )

export const useWalletTransactions = (query: Parameters<typeof wallet.transactions.get>[0] = {}) =>
  useBizQuery(
    wallet.transactions.get(query),
  )

export const useCreateWalletMutation = () =>
  useMutation({
    mutationKey: ["createWallet"],
    mutationFn: () => apiClient.wallets.$post(),
    async onError(err) {
      toast.error(await getFetchErrorMessage(err))
    },
    onSuccess() {
      wallet.get().invalidate()
      toast("🎉 Wallet created.")
    },
  })

export const useClaimWalletDailyRewardTtl = () =>
  useBizQuery(
    wallet.claimDailyRewardTtl(),
    { refetchInterval: 5000 },
  )

export const useClaimWalletDailyRewardMutation = () => useMutation({
  mutationKey: ["claimWalletDailyReward"],
  mutationFn: () => apiClient.wallets.transactions.claim_daily.$post(),
  async onError(err) {
    toast.error(await getFetchErrorMessage(err))
  },
  onSuccess() {
    wallet.get().invalidate()
    wallet.claimDailyRewardTtl().invalidate()
    toast("🎉 Daily reward claimed.")
  },
})

export const useWalletTipMutation = () => useMutation({
  mutationKey: ["walletTip"],
  mutationFn: (data: Parameters<typeof apiClient.wallets.transactions.tip.$post>[0]["json"]) =>
    apiClient.wallets.transactions.tip.$post({ json: data }),
  async onError(err) {
    toast.error(await getFetchErrorMessage(err))
  },
  onSuccess() {
    wallet.get().invalidate()
    wallet.transactions.get().invalidate()
    toast("🎉 Tipped.")
  },
})
