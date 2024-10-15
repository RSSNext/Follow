import { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { useWhoami } from "~/atoms/user"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { MotionButtonBase } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { EllipsisHorizontalTextWithTooltip } from "~/components/ui/typography"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { cn } from "~/lib/utils"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { SettingSectionTitle } from "~/modules/settings/section"
import { Balance } from "~/modules/wallet/balance"
import type { useWalletTransactions } from "~/queries/wallet"
import { useWalletRanking } from "~/queries/wallet"

const medals = ["", "🥇", "🥈", "🥉"]
const rankNumber = (index: number) => {
  if (index < medals.length) {
    return <span className="-ml-[3px]">{medals[index]}</span>
  }
  return <span>{index}</span>
}

export const PowerRanking: Component = ({ className }) => {
  const { t } = useTranslation("settings")
  const ranking = useWalletRanking()

  return (
    <div className="relative flex min-w-0 grow flex-col">
      <SettingSectionTitle title={t("wallet.ranking.title")} />
      <div className={cn("w-fit min-w-0 grow overflow-x-auto", className)}>
        <Table className="w-full table-fixed text-sm">
          <TableHeader className="sticky top-0 bg-theme-background">
            <TableRow className="[&_*]:!font-semibold">
              <TableHead className="w-20">#</TableHead>
              <TableHead>{t("wallet.ranking.name")}</TableHead>
              <TableHead>{t("wallet.ranking.power")}</TableHead>
              <TableHead>{t("wallet.ranking.level")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.data?.map((row, index) => {
              const lastRow = ranking.data?.[index - 1]
              const hasGap = lastRow?.rank && row.rank && row.rank - lastRow.rank !== 1

              return (
                <Fragment key={row.userId}>
                  {!!hasGap && (
                    <>
                      <TableRow>
                        <TableCell className="py-2">...</TableCell>
                      </TableRow>
                      <TableRow>
                        <div className="h-px w-full" />
                      </TableRow>
                    </>
                  )}
                  <TableRow>
                    <TableCell className="py-2">{!!row.rank && rankNumber(row.rank)}</TableCell>
                    <TableCell className="py-2">
                      <UserRenderer user={row.user} />
                    </TableCell>
                    <TableCell className="py-2">
                      <Balance>{row.powerToken}</Balance>
                    </TableCell>
                    <TableCell className="py-2">{row.level}</TableCell>
                  </TableRow>
                </Fragment>
              )
            })}
            <TableRow>
              <TableCell className="py-2">...</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

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
      className="flex w-full min-w-0 cursor-button items-center gap-2"
    >
      <Avatar className="aspect-square size-6 duration-200 animate-in fade-in-0">
        <AvatarImage src={replaceImgUrlIfNeed(user?.image || undefined)} />
        <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
      </Avatar>

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
