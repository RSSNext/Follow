import { useTranslation } from "react-i18next"

import { useWhoami } from "~/atoms/user"
import { Logo } from "~/components/icons/logo"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { MotionButtonBase } from "~/components/ui/button"
import { RelativeTime } from "~/components/ui/datetime"
import { LoadingCircle } from "~/components/ui/loading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { EllipsisHorizontalTextWithTooltip } from "~/components/ui/typography"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { cn } from "~/lib/utils"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { SettingSectionTitle } from "~/modules/settings/section"
import { Balance } from "~/modules/wallet/balance"
import { useWallet, useWalletTransactions } from "~/queries/wallet"

export const TransactionsSection = () => {
  const { t } = useTranslation("settings")
  const user = useWhoami()
  const wallet = useWallet({ userId: user?.id })
  const myWallet = wallet.data?.[0]

  const transactions = useWalletTransactions({ fromOrToUserId: user?.id })

  if (!myWallet) return null

  if (transactions.isLoading) {
    return (
      <div className="center mt-12">
        <LoadingCircle size="large" />
      </div>
    )
  }

  return (
    <div className="relative flex min-w-0 grow flex-col">
      <SettingSectionTitle title={t("wallet.transactions.title")} />

      <div className="w-fit min-w-0 grow overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="[&_*]:!font-semibold">
              <TableHead className="whitespace-nowrap text-center" size="sm">
                {t("wallet.transactions.type")}
              </TableHead>
              <TableHead className="whitespace-nowrap text-center" size="sm">
                {t("wallet.transactions.amount")}
              </TableHead>
              <TableHead className="whitespace-nowrap pl-8" size="sm">
                {t("wallet.transactions.from")}
              </TableHead>
              <TableHead className="whitespace-nowrap pl-8" size="sm">
                {t("wallet.transactions.to")}
              </TableHead>
              <TableHead className="whitespace-nowrap pl-6" size="sm">
                {t("wallet.transactions.date")}
              </TableHead>
              <TableHead className="whitespace-nowrap pl-6 text-center" size="sm">
                {t("wallet.transactions.tx")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.data?.map((row) => (
              <TableRow key={row.hash}>
                <TableCell align="center" size="sm">
                  <TypeRenderer type={row.type} />
                </TableCell>
                <TableCell align="center" size="sm">
                  <BalanceRenderer
                    sign={row.fromUserId === user?.id ? "-" : "+"}
                    amount={row.powerToken}
                  />
                </TableCell>
                <TableCell align="left" className="px-3" size="sm">
                  <UserRenderer user={row.fromUser} />
                </TableCell>
                <TableCell align="left" className="truncate px-3" size="sm">
                  <UserRenderer user={row.toUser} />
                </TableCell>

                <TableCell align="left" size="sm" className="whitespace-nowrap pl-6">
                  <EllipsisHorizontalTextWithTooltip>
                    <RelativeTime date={row.createdAt} dateFormatTemplate="l" />
                  </EllipsisHorizontalTextWithTooltip>
                </TableCell>
                <TableCell align="left" size="sm" className="pl-6">
                  <Tooltip>
                    <TooltipTrigger>
                      <a target="_blank" href={`https://scan.rss3.io/tx/${row.hash}`}>
                        {row.hash.slice(0, 6)}...
                      </a>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent>{row.hash}</TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!transactions.data?.length && (
        <div className="my-2 w-full text-center text-sm text-zinc-400">
          {t("wallet.transactions.noTransactions")}
        </div>
      )}
    </div>
  )
}

const TypeRenderer = ({
  type,
}: {
  type: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["type"]
}) => {
  const { t } = useTranslation("settings")
  return (
    <div
      className={cn("center rounded-full px-1.5 py-px text-xs uppercase", {
        "bg-theme-accent-700 text-white": type === "tip",
        "bg-green-700 text-white": type === "mint",
        "bg-red-700 text-white": type === "burn",
        "bg-yellow-700 text-white": type === "withdraw",
        "bg-blue-700 text-white": type === "purchase",
      })}
    >
      {t(`wallet.transactions.types.${type}`)}
    </div>
  )
}

const BalanceRenderer = ({
  sign,
  amount,
}: {
  sign: "+" | "-"
  amount: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["powerToken"]
}) => (
  <div
    className={cn("flex items-center justify-center", {
      "text-green-500": sign === "+",
      "text-red-500": sign === "-",
    })}
  >
    {sign}
    <Balance>{amount}</Balance>
  </div>
)

const UserRenderer = ({
  user,
}: {
  user?: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number][
    | "fromUser"
    | "toUser"]
}) => {
  const { t } = useTranslation("settings")
  const me = useWhoami()
  const isMe = user?.id === me?.id

  const name = isMe ? t("wallet.transactions.you") : user?.name || APP_NAME

  const presentUserModal = usePresentUserProfileModal("drawer")
  return (
    <MotionButtonBase
      onClick={() => {
        if (user?.id) presentUserModal(user.id)
      }}
      className="flex w-full min-w-0 cursor-button items-center"
    >
      {name === APP_NAME ? (
        <Logo className="aspect-square size-4" />
      ) : (
        <Avatar className="aspect-square size-4 duration-200 animate-in fade-in-0">
          <AvatarImage src={replaceImgUrlIfNeed(user?.image || undefined)} />
          <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}

      <div className="ml-1 w-0 grow truncate">
        <EllipsisHorizontalTextWithTooltip className="text-left">
          {isMe ? (
            <span className="font-bold">{t("wallet.transactions.you")}</span>
          ) : (
            <span>{name}</span>
          )}
        </EllipsisHorizontalTextWithTooltip>
      </div>
    </MotionButtonBase>
  )
}
