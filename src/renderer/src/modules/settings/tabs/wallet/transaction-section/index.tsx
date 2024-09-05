import { useWhoami } from "@renderer/atoms/user"
import { Logo } from "@renderer/components/icons/logo"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { MotionButtonBase } from "@renderer/components/ui/button"
import { RelativeTime } from "@renderer/components/ui/datetime"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table"
import { cn } from "@renderer/lib/utils"
import { usePresentUserProfileModal } from "@renderer/modules/profile/hooks"
import { SettingSectionTitle } from "@renderer/modules/settings/section"
import { Balance } from "@renderer/modules/wallet/balance"
import { useWallet, useWalletTransactions } from "@renderer/queries/wallet"

export const TransactionsSection = () => {
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

  // if (transactions.data?.length === 0) return <div className="text-theme-disabled">No transactions</div>

  return (
    <div className="mt-8">
      <SettingSectionTitle title="Transactions" />

      <ScrollArea.ScrollArea viewportClassName="max-h-[210px]">
        <Table>
          <TableHeader>
            <TableRow className="[&_*]:!font-semibold">
              <TableHead className="w-16 text-center" size="sm">
                Type
              </TableHead>
              <TableHead className="text-center" size="sm">
                Amount
              </TableHead>
              <TableHead className="pl-8" size="sm">
                From
              </TableHead>
              <TableHead className="pl-8" size="sm">
                To
              </TableHead>
              <TableHead className="pl-6" size="sm">
                Date
              </TableHead>
              <TableHead className="pl-6" size="sm">
                Tx
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
                <TableCell align="left" className="px-3" size="sm">
                  <UserRenderer user={row.toUser} />
                </TableCell>

                <TableCell align="left" size="sm" className="pl-6">
                  <RelativeTime date={row.createdAt} />
                </TableCell>
                <TableCell align="left" size="sm" className="pl-6">
                  <a target="_blank" href={`https://scan.rss3.io/tx/${row.hash}`}>{row.hash.slice(0, 6)}...</a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!transactions.data?.length && (
          <div className="my-2 w-full text-center text-sm text-zinc-400">
            No transactions
          </div>
        )}
      </ScrollArea.ScrollArea>
    </div>
  )
}

const TypeRenderer = ({
  type,
}: {
  type: NonNullable<
    ReturnType<typeof useWalletTransactions>["data"]
  >[number]["type"]
}) => (
  <div
    className={cn("center rounded-full px-1.5 py-px text-xs", {
      "bg-theme-accent-700 text-white": type === "tip",
      "bg-green-700 text-white": type === "mint",
      "bg-red-700 text-white": type === "burn",
      "bg-yellow-700 text-white": type === "withdraw",
      "bg-blue-700 text-white": type === "purchase",
    })}
  >
    {type}
  </div>
)

const BalanceRenderer = ({
  sign,
  amount,
}: {
  sign: "+" | "-"
  amount: NonNullable<
    ReturnType<typeof useWalletTransactions>["data"]
  >[number]["powerToken"]
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
  const me = useWhoami()
  const isMe = user?.id === me?.id

  const name = isMe ? "You" : user?.name || APP_NAME

  const presentUserModal = usePresentUserProfileModal("drawer")
  return (
    <MotionButtonBase
      onClick={() => {
        if (user?.id) presentUserModal(user.id)
      }}
      className={cn(
        "flex items-center",
        user?.id ? "cursor-pointer" : "cursor-default",
      )}
    >
      {name === APP_NAME ? (
        <Logo className="aspect-square size-4" />
      ) : (
        <Avatar className="aspect-square size-4 duration-200 animate-in fade-in-0">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}

      <div className="ml-1">
        {isMe ? <span className="font-bold">You</span> : name}
      </div>
    </MotionButtonBase>
  )
}
