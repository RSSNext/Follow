import { useUser } from "@renderer/atoms/user"
import { Avatar, AvatarFallback, AvatarImage } from "@renderer/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@renderer/components/ui/table"
import { Balance } from "@renderer/components/ui/wallet/balance"
import dayjs from "@renderer/lib/dayjs"
import { cn } from "@renderer/lib/utils"
import { SettingSectionTitle } from "@renderer/modules/settings/section"
import { useWallet, useWalletTransactions } from "@renderer/queries/wallet"

export const TransactionsSection = () => {
  const user = useUser()
  const wallet = useWallet({ userId: user?.id })
  const myWallet = wallet.data?.[0]

  const transactions = useWalletTransactions({ fromOrToUserId: user?.id })

  if (!myWallet) return

  if (transactions.isLoading) return <div className="text-theme-disabled">Loading...</div>

  // if (transactions.data?.length === 0) return <div className="text-theme-disabled">No transactions</div>

  return (
    <div className="mt-8">
      <SettingSectionTitle title="Transactions" />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead size="sm">
                Type
              </TableHead>
              <TableHead size="sm">
                Amount
              </TableHead>
              <TableHead size="sm">
                From
              </TableHead>
              <TableHead size="sm">
                To
              </TableHead>
              <TableHead size="sm">
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
                  {dayjs(row.createdAt).fromNow()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!transactions.data?.length && (
          <div className="my-2 w-full text-center text-sm text-zinc-400">No transactions</div>
        )}
      </div>
    </div>
  )
}

const TypeRenderer = ({ type }: { type: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["type"] }) => (
  <div className={cn("center rounded-full p-px text-xs uppercase", {
    "bg-theme-accent-700 text-white": type === "tip",
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
  <div className={cn("flex items-center justify-center", {
    "text-green-500": sign === "+",
    "text-red-500": sign === "-",
  })}
  >
    {sign}
    <Balance>{amount}</Balance>
  </div>
)

const UserRenderer = ({ user }: { user?: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["fromUser" | "toUser"] }) => {
  const me = useUser()
  const isMe = user?.id === me?.id

  const name = isMe ? "You" : user?.name || "SYSTEM"

  return (
    <div className="center">
      <Avatar className="aspect-square size-4">
        <AvatarImage src={user?.image || undefined} />
        <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="ml-1">
        {isMe ? <span className="font-bold">You</span> : name}
      </div>
    </div>
  )
}
