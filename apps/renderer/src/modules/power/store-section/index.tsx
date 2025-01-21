import { Button } from "@follow/components/ui/button/index.js"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@follow/components/ui/table/index.jsx"
import { useTranslation } from "react-i18next"

import { useTOTPModalWrapper } from "~/modules/profile/hooks"
import { SettingSectionTitle } from "~/modules/settings/section"
import type { Product } from "~/queries/store"
import { useProductList, usePurchaseProduct } from "~/queries/store"
import { useWallet } from "~/queries/wallet"

export const StoreSection: Component = () => {
  const { t } = useTranslation("settings")

  const wallet = useWallet()
  const myWallet = wallet.data?.[0]

  if (!myWallet) return null

  return (
    <div className="relative flex min-w-0 grow flex-col">
      <SettingSectionTitle title={t("wallet.store.title")} />
      <ProductList />
    </div>
  )
}

const ProductList: Component = () => {
  const { t } = useTranslation("settings")
  const { data: products } = useProductList()
  if (!products) return null

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("wallet.store.product.name")}</TableHead>
          <TableHead>{t("wallet.store.product.category")}</TableHead>
          <TableHead>{t("wallet.store.product.price")}</TableHead>
          <TableHead>{t("wallet.store.product.quantity_per_user")}</TableHead>
          <TableHead>{t("wallet.store.product.quantity_purchased")}</TableHead>
          <TableHead>{t("wallet.store.product.action")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell>{product.quantityPerUser}</TableCell>
            <TableCell>{product.quantityPurchased}</TableCell>
            <TableCell className="w-40">
              <PurchaseButton product={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const PurchaseButton: Component<{ product: Product }> = ({ product }) => {
  const mutation = usePurchaseProduct()
  const { t } = useTranslation("settings")
  const present = useTOTPModalWrapper(mutation.mutateAsync)
  return (
    <Button
      disabled={product.quantityPurchased >= product.quantityPerUser}
      onClick={() => present({ productId: product.id })}
      isLoading={mutation.isPending}
    >
      {t("wallet.store.product.buy")}
    </Button>
  )
}
