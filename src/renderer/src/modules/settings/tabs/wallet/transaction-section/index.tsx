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

  if (transactions.data?.length === 0) return <div className="text-theme-disabled">No transactions</div>

  return (
    <div>
      <SettingSectionTitle title="Transactions" />

      <div className="overflow-x-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead size="sm" className="uppercase">Type</TableHead>
              <TableHead size="sm" className="uppercase">Amount</TableHead>
              <TableHead size="sm" className="uppercase">From</TableHead>
              <TableHead size="sm" className="uppercase">To</TableHead>
              <TableHead size="sm" className="uppercase">Entry</TableHead>
              <TableHead size="sm" className="uppercase">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.data?.map(
              (row) => (
                <TableRow key={row.hash}>
                  <TableCell align="center" size="sm"><TypeRenderer>{row.type}</TypeRenderer></TableCell>
                  <TableCell align="center" size="sm"><Balance>{row.powerToken}</Balance></TableCell>
                  <TableCell align="center" size="sm"><UserRenderer user={row.fromUser} /></TableCell>
                  <TableCell align="center" size="sm"><UserRenderer user={row.toUser} /></TableCell>
                  <TableCell align="center" size="sm"><EntryRenderer entry={row.toEntry} /></TableCell>
                  <TableCell align="center" size="sm">{dayjs(row.createdAt).fromNow()}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const TypeRenderer = ({ children }: { children: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["type"] }) => (
  <div className={cn("center rounded-full p-px text-xs uppercase", {
    "bg-theme-primary text-white": children === "tip",
    "bg-green-700 text-white": children === "mint",
    "bg-red-700 text-white": children === "burn",
    "bg-yellow-700 text-white": children === "withdraw",
  })}
  >
    {children}
  </div>
)

const UserRenderer = ({ user }: { user?: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["fromUser" | "toUser"] }) => {
  const me = useUser()
  const isMe = user?.id === me?.id

  return (
    <div className="center">
      <Avatar className="aspect-square size-4">
        <AvatarImage src={user?.image || undefined} />
        <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="ml-1">
        {isMe ? <span className="font-bold">You</span> : user?.name || "NULL"}
      </div>
    </div>
  )
}

const EntryRenderer = ({ entry }: { entry: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["toEntry"] }) => (
  <div className="center line-clamp-1 truncate">
    {entry?.title ?? "-"}
  </div>
)
