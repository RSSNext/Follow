import { Avatar, AvatarFallback, AvatarImage } from "@renderer/components/ui/avatar"
import { Button } from "@renderer/components/ui/button"
import { CopyButton } from "@renderer/components/ui/code-highlighter"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient, getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { usePresentUserProfileModal } from "@renderer/modules/profile/hooks"
import { Queries } from "@renderer/queries"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { SettingsTitle } from "../title"

export const SettingInvitations = () => {
  const invitations = useAuthQuery(Queries.invitations.list())

  const newInvitation = useMutation({
    mutationKey: ["newInvitation"],
    mutationFn: () => apiClient.invitations.new.$post(),
    async onError(err) {
      toast.error(getFetchErrorMessage(err))
    },
    onSuccess() {
      Queries.invitations.list().invalidate()
      toast("🎉 New invitation generated")
    },
  })
  const presentUserProfile = usePresentUserProfileModal("drawer")

  return (
    <>
      <SettingsTitle />
      <div className="mt-4">
        <Button onClick={() => newInvitation.mutate()}>
          New invitation
        </Button>
        <Table className="mt-4">
          <TableHeader>
            <TableRow className="[&_*]:!font-semibold">
              <TableHead className="w-16 text-center" size="sm">
                Code
              </TableHead>
              <TableHead className="text-center" size="sm">
                Creation Time
              </TableHead>
              <TableHead className="text-center" size="sm">
                Used by
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.data?.map((row) => (
              <TableRow key={row.code}>
                <TableCell align="center" size="sm">
                  <div className="group relative flex items-center justify-center gap-2">
                    <span>{row.code}</span>
                    <CopyButton
                      value={row.code}
                      className="absolute -right-6 p-0.5 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </TableCell>
                <TableCell align="center" size="sm">
                  {row.createdAt && new Date(row.createdAt).toLocaleString()}
                </TableCell>
                <TableCell align="center" size="sm">
                  {row.users ? (
                    <div
                      onClick={() => {
                        presentUserProfile(row.users?.id)
                      }}
                    >
                      <Avatar className="aspect-square size-5 border border-border ring-1 ring-background">
                        <AvatarImage src={row.users?.image || undefined} />
                        <AvatarFallback>{row.users?.name?.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                  ) : "Not used"}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!invitations.data?.length && (
          <div className="my-2 w-full text-center text-sm text-zinc-400">
            No invitations
          </div>
        )}
      </div>
    </>
  )
}
