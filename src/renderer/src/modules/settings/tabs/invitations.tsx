import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { Button, MotionButtonBase } from "@renderer/components/ui/button"
import { CopyButton } from "@renderer/components/ui/code-highlighter"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip"
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

  return (
    <>
      <SettingsTitle />
      <div className="absolute inset-x-0 bottom-10 top-4 flex flex-col">
        <Tooltip>
          <TooltipTrigger asChild>
            <MotionButtonBase
              type="button"
              onClick={() => {
                newInvitation.mutate()
              }}
              className="center absolute bottom-0 right-2 z-10 size-10 rounded-full bg-accent text-white drop-shadow"
            >
              <i className="i-mingcute-user-add-2-line size-4" />
            </MotionButtonBase>
          </TooltipTrigger>

          <TooltipContent>
            New invitation
          </TooltipContent>
        </Tooltip>
        <ScrollArea.ScrollArea scrollbarClassName="w-1" rootClassName="flex grow">
          {invitations.data?.length ? (
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
                    <TableCell
                      align="center"
                      className="tabular-nums"
                      size="sm"
                    >
                      {row.createdAt &&
                        new Date(row.createdAt).toLocaleString()}
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
          ) : (
            <div className="mt-36 w-full text-center text-sm text-zinc-400">
              <p>No invitations</p>

              <div className="mt-6">
                <Button
                  onClick={() => {
                    newInvitation.mutate()
                  }}
                >
                  Create Invitation
                </Button>
              </div>
            </div>
          )}
        </ScrollArea.ScrollArea>
      </div>
    </>
  )
}
