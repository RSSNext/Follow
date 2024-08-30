import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { CopyButton } from "@renderer/components/ui/code-highlighter"
import { RootPortal } from "@renderer/components/ui/portal"
import { useScrollViewElement } from "@renderer/components/ui/scroll-area/hooks"
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
    onSuccess(data) {
      Queries.invitations.list().invalidate()
      toast("🎉 New invitation generated, invite code is copied")
      navigator.clipboard.writeText(data.data)
    },
  })
  const presentUserProfile = usePresentUserProfileModal("drawer")

  const scrollViewElement = useScrollViewElement()

  return (
    <>
      <SettingsTitle />
      <div className="relative mt-4">
        <RootPortal to={scrollViewElement!}>
          <button
            type="button"
            onClick={() => {
              newInvitation.mutate()
            }}
            className="center absolute bottom-4 right-4 size-8 rounded-full bg-accent text-white drop-shadow"
          >
            <i className="i-mingcute-user-add-2-line size-4" />
          </button>
        </RootPortal>
        <Table className="mt-4">
          <TableHeader className="border-b">
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
          <TableBody className="border-t-[12px] border-transparent">
            {invitations.data?.map((row) => (
              <TableRow key={row.code}>
                <TableCell align="center" size="sm">
                  <div className="group relative flex items-center justify-center gap-2 font-mono">
                    <span>{row.code}</span>
                    <CopyButton
                      value={row.code}
                      className="absolute -right-6 p-1 opacity-0 group-hover:opacity-100 [&_i]:size-3"
                    />
                  </div>
                </TableCell>
                <TableCell align="center" className="tabular-nums" size="sm">
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
                        <AvatarFallback>
                          {row.users?.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    "Not used"
                  )}
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
