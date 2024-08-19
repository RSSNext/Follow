import { useWhoami } from "@renderer/atoms/user"
import { Logo } from "@renderer/components/icons/logo"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { RelativeTime } from "@renderer/components/ui/datetime"
import { LoadingCircle } from "@renderer/components/ui/loading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table"
import { Balance } from "@renderer/components/ui/wallet/balance"
import { cn } from "@renderer/lib/utils"
import { SettingSectionTitle } from "@renderer/modules/settings/section"
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

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="[&_*]:!font-semibold">
              <TableHead className="w-16 text-center" size="sm">
                Type
              </TableHead>
              <TableHead className="text-center" size="sm">
                Amount
              </TableHead>
              <TableHead className="text-center" size="sm">
                From
              </TableHead>
              <TableHead className="text-center" size="sm">
                To
              </TableHead>
              <TableHead className="text-center" size="sm">
                Date
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
                <TableCell align="center" size="sm">
                  <UserRenderer user={row.fromUser} />
                </TableCell>
                <TableCell align="center" size="sm">
                  <UserRenderer user={row.toUser} />
                </TableCell>
                {/* <TableCell align="center" size="sm"><FeedRenderer feed={row.toFeed} /></TableCell> */}
                <TableCell align="center" size="sm">
                  <RelativeTime date={row.createdAt} />
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
      </div>
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
    className={cn("center rounded-full p-px text-xs uppercase", {
      "bg-accent-700 text-white": type === "tip",
      "bg-green-700 text-white": type === "mint",
      "bg-red-700 text-white": type === "burn",
      "bg-yellow-700 text-white": type === "withdraw",
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

  return (
    <div className="center">
      {name === APP_NAME ? (
        <Logo className="aspect-square size-4" />
      ) : (
        <Avatar className="aspect-square size-4">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}

      <div className="ml-1">
        {isMe ? <span className="font-bold">You</span> : name}
      </div>
    </div>
  )
}
