import { useMutation } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useServerConfigs } from "~/atoms/server-configs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { CopyButton } from "~/components/ui/code-highlighter"
import { Divider } from "~/components/ui/divider"
import { LoadingCircle } from "~/components/ui/loading"
import { useModalStack } from "~/components/ui/modal"
import { ScrollArea } from "~/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { toastFetchError } from "~/lib/error-parser"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { Queries } from "~/queries"

export const SettingInvitations = () => {
  const { t } = useTranslation("settings")
  const invitations = useAuthQuery(Queries.invitations.list())
  const limitation = useAuthQuery(Queries.invitations.limitation())

  const { present } = useModalStack()
  const presentUserProfile = usePresentUserProfileModal("drawer")

  const serverConfigs = useServerConfigs()

  return (
    <section className="mt-4">
      <div className="mb-4 space-y-2 text-sm">
        <Trans ns="settings" i18nKey="invitation.earlyAccess">
          Follow is currently in <strong>early access</strong> and requires an invitation code to
          use.
        </Trans>
        <p className="flex items-center">
          <Trans
            ns="settings"
            values={{
              INVITATION_PRICE: serverConfigs?.INVITATION_PRICE,
            }}
            components={{
              PowerIcon: (
                <i className="i-mgc-power mx-0.5 size-3.5 -translate-y-px text-base text-accent" />
              ),
            }}
            i18nKey="invitation.generateCost"
          />
        </p>
        <p>
          <Trans
            ns="settings"
            values={{
              limitation: limitation.data,
            }}
            i18nKey="invitation.limitationMessage"
          />
        </p>
      </div>
      <Button
        disabled={
          !limitation.data || (invitations?.data && invitations?.data?.length >= limitation.data)
        }
        onClick={() => {
          present({
            title: t("invitation.confirmModal.title"),
            content: ({ dismiss }) => <ConfirmModalContent dismiss={dismiss} />,
          })
        }}
      >
        <i className="i-mgc-love-cute-re mr-1 text-base" />
        {t("invitation.generateButton")}
      </Button>
      <Divider className="mb-6 mt-8" />
      <div className="flex flex-1 flex-col">
        <ScrollArea.ScrollArea>
          {invitations.data?.length ? (
            <Table className="mt-4">
              <TableHeader className="border-b">
                <TableRow className="[&_*]:!font-semibold">
                  <TableHead className="w-16 text-center" size="sm">
                    {t("invitation.tableHeaders.code")}
                  </TableHead>
                  <TableHead className="text-center" size="sm">
                    {t("invitation.tableHeaders.creationTime")}
                  </TableHead>
                  <TableHead className="max-w-[12ch] text-center" size="sm">
                    {t("invitation.tableHeaders.usedBy")}
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
                          <TooltipTrigger>
                            <button
                              type="button"
                              className="cursor-pointer"
                              onClick={() => {
                                presentUserProfile(row.users?.id)
                              }}
                            >
                              <Avatar className="aspect-square size-5 border border-border ring-1 ring-background">
                                <AvatarImage
                                  src={replaceImgUrlIfNeed(row.users?.image || undefined)}
                                />
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
                        t("invitation.notUsed")
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
              <p>{t("invitation.noInvitations")}</p>
            </div>
          )}
        </ScrollArea.ScrollArea>
      </div>
    </section>
  )
}

const ConfirmModalContent = ({ dismiss }: { dismiss: () => void }) => {
  const { t } = useTranslation("settings")
  const newInvitation = useMutation({
    mutationKey: ["newInvitation"],
    mutationFn: () => apiClient.invitations.new.$post(),
    onError(err) {
      toastFetchError(err)
    },
    onSuccess(data) {
      Queries.invitations.list().invalidate()
      toast(t("invitation.newInvitationSuccess"))
      navigator.clipboard.writeText(data.data)
      dismiss()
    },
  })

  const serverConfigs = useServerConfigs()

  return (
    <>
      <div className="flex items-center text-sm">
        <Trans
          ns="settings"
          values={{
            INVITATION_PRICE: serverConfigs?.INVITATION_PRICE,
          }}
          components={{
            PowerIcon: <i className="i-mgc-power mx-0.5 size-3.5 -translate-y-px text-accent" />,
          }}
          i18nKey="invitation.generateCost"
        />
      </div>
      <div className="mt-2 text-sm">{t("invitation.confirmModal.confirm")}</div>
      <div className="mt-4 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={dismiss}>
          {t("invitation.confirmModal.cancel")}
        </Button>
        <Button isLoading={newInvitation.isPending} onClick={() => newInvitation.mutate()}>
          {t("invitation.confirmModal.continue")}
        </Button>
      </div>
    </>
  )
}
