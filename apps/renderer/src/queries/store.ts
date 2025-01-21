import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"

export const store = {
  products: {
    get: () =>
      defineQuery(["store", "products"], async () => {
        const { data } = await apiClient.store.products.$get()
        return data.products
      }),
  },
}
export type Product = Awaited<
  ReturnType<typeof apiClient.store.products.$get>
>["data"]["products"][number]
export const useProductList = () => useAuthQuery(store.products.get())

export const usePurchaseProduct = () => {
  const { t } = useTranslation("settings")
  return useMutation({
    mutationKey: ["purchaseProduct"],
    mutationFn: ({ productId, TOTPCode }: { productId: string } & { TOTPCode?: string }) =>
      apiClient.store.products.$post({ json: { productId, TOTPCode } }),
    onSuccess() {
      toast.success(t("wallet.store.product.purchase_success"))
      store.products.get().invalidate()
    },
  })
}
