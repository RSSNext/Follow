import { Avatar, AvatarFallback, AvatarImage } from "@renderer/components/ui/avatar"
import { Button } from "@renderer/components/ui/button"
import { CopyButton } from "@renderer/components/ui/code-highlighter"
import { Divider } from "@renderer/components/ui/divider"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useModalStack } from "@renderer/components/ui/modal"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { INVITATION_PRICE } from "@renderer/constants"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { toastFetchError } from "@renderer/lib/error-parser"
import { usePresentUserProfileModal } from "@renderer/modules/profile/hooks"
import { Queries } from "@renderer/queries"
import { useMutation } from "@tanstack/react-query"
import dayjs from "dayjs"
import { toast } from "sonner"

export const SettingInvitations = () => {
  const invitations = useAuthQuery(Queries.invitations.list())

  const { present } = useModalStack()
  const presentUserProfile = usePresentUserProfileModal("drawer")

  return (
    <section className="mt-4">
      <div className="mb-4 space-y-2 text-sm">
        <p>
          Follow is currently in <strong>early access</strong> and requires an invitation code to
          use.
        </p>
        <p className="flex items-center">
          <span>You can spend {INVITATION_PRICE} </span>
          <i className="i-mgc-power mx-0.5 text-base text-accent" />
          <span> Power to generate an invitation code for your friends.</span>
        </p>
      </div>
      <Button
        onClick={() => {
          present({
            title: "Confirm",
            content: ({ dismiss }) => <ConfirmModalContent dismiss={dismiss} />,
          })
        }}
      >
        <i className="i-mgc-heart-hand-cute-re mr-1" />
        Generate new code
      </Button>
      <Divider className="mb-6 mt-8" />
      <div className="flex flex-1 flex-col">
        <ScrollArea.ScrollArea viewportClassName="max-h-[380px]">
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
                  <TableRow key={row.code} className="h-8">
                    <TableCell align="center" size="sm">
                      <div className="group relative flex items-center justify-center gap-2 font-mono">
                        <span className="shrink-0">{row.code}</span>
                        <CopyButton
                          value={row.code}
                          className="absolute -right-6 p-1 opacity-0 group-hover:opacity-100 [&_i]:size-3"
                        />
                      </div>
                    </TableCell>
                    <TableCell align="center" className="tabular-nums" size="sm">
                      {row.createdAt && dayjs(row.createdAt).format("ll")}
                    </TableCell>
                    <TableCell align="center" size="sm">
                      {row.users ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="center h-full cursor-pointer"
                              onClick={() => {
                                presentUserProfile(row.users?.id)
                              }}
                            >
                              <Avatar className="aspect-square size-5 border border-border ring-1 ring-background">
                                <AvatarImage src={row.users?.image || undefined} />
                                <AvatarFallback>{row.users?.name?.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                            </button>
                          </TooltipTrigger>
                          {row.users?.name && (
                            <TooltipPortal>
                              <TooltipContent>{row.users?.name}</TooltipContent>
                            </TooltipPortal>
                          )}
                        </Tooltip>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : invitations.isLoading ? (
            <LoadingCircle size="large" className="center absolute inset-0" />
          ) : (
            <div className="mt-36 w-full text-center text-sm text-zinc-400">
              <p>No invitations</p>
            </div>
          )}
        </ScrollArea.ScrollArea>
      </div>
    </section>
  )
}

const ConfirmModalContent = ({ dismiss }: { dismiss: () => void }) => {
  const newInvitation = useMutation({
    mutationKey: ["newInvitation"],
    mutationFn: () => apiClient.invitations.new.$post(),
    async onError(err) {
      toastFetchError(err)
    },
    onSuccess(data) {
      Queries.invitations.list().invalidate()
      toast("🎉 New invitation generated, invite code is copied")
      navigator.clipboard.writeText(data.data)
      dismiss()
    },
  })

  return (
    <>
      <div className="flex items-center">
        <span>Generating an invitation code will cost you {INVITATION_PRICE} </span>
        <i className="i-mgc-power mx-1 text-base text-accent" />
        <span>Power. Do you want to continue?</span>
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={dismiss}>
          Cancel
        </Button>
        <Button isLoading={newInvitation.isPending} onClick={() => newInvitation.mutate()}>
          Continue
        </Button>
      </div>
    </>
  )
}
