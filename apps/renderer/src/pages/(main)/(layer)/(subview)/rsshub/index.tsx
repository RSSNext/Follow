import { Logo } from "@follow/components/icons/logo.jsx"
import { Button } from "@follow/components/ui/button/index.js"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@follow/components/ui/table/index.jsx"
import { EllipsisTextWithTooltip } from "@follow/components/ui/typography/index.js"
import type { RSSHubModel } from "@follow/models"
import { useTranslation } from "react-i18next"

import RSSHubIconUrl from "~/assets/rsshub-icon.png?url"
import { whoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useAuthQuery } from "~/hooks/common"
import { useSubViewTitle } from "~/modules/app-layout/subview/hooks"
import { useTOTPModalWrapper } from "~/modules/profile/hooks"
import { AddModalContent } from "~/modules/rsshub/add-modal-content"
import { SetModalContent } from "~/modules/rsshub/set-modal-content"
import { UserAvatar } from "~/modules/user/UserAvatar"
import { Queries } from "~/queries"
import { useSetRSSHubMutation } from "~/queries/rsshub"

const RSSHubIcon = new URL(RSSHubIconUrl, import.meta.url).href
export function Component() {
  const { t } = useTranslation("settings")
  const { present } = useModalStack()

  useSubViewTitle("words.rsshub")

  const list = useAuthQuery(Queries.rsshub.list())

  return (
    <div className="relative flex w-full flex-col items-center gap-8 px-4 pb-8 lg:px-20 lg:pb-4">
      <div className="center">
        <img src={RSSHubIcon} className="mt-12 size-20" />
      </div>
      <div className="text-2xl font-bold">{t("words.rsshub", { ns: "common" })}</div>
      <div className="max-w-4xl text-sm">{t("rsshub.description")}</div>
      <Button
        onClick={() =>
          present({
            title: t("rsshub.add_new_instance"),
            content: ({ dismiss }) => <AddModalContent dismiss={dismiss} />,
          })
        }
      >
        <div className="flex items-center gap-1">
          <i className="i-mgc-add-cute-re mr-1 text-base" />
          <span>{t("rsshub.add_new_instance")}</span>
        </div>
      </Button>
      <div className="text-sm text-muted-foreground">{t("rsshub.public_instances")}</div>
      <List data={list?.data} />
    </div>
  )
}

function List({ data }: { data?: RSSHubModel[] }) {
  const { t } = useTranslation("settings")
  const me = whoami()
  const status = useAuthQuery(Queries.rsshub.status())
  const setRSSHubMutation = useSetRSSHubMutation()
  const presetTOTPModal = useTOTPModalWrapper(setRSSHubMutation.mutateAsync)
  const { present } = useModalStack()

  return (
    <Table containerClassName="mt-2 overflow-x-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold" size="sm" />
          <TableHead className="w-[150px] font-bold" size="sm">
            {t("rsshub.table.owner")}
          </TableHead>
          <TableHead className="font-bold" size="sm">
            {t("rsshub.table.description")}
          </TableHead>
          <TableHead className="w-[120px] text-right font-bold" size="sm">
            {t("rsshub.table.price")}
          </TableHead>
          <TableHead className="w-[100px] text-right font-bold" size="sm">
            {t("rsshub.table.userCount")}
          </TableHead>
          <TableHead className="w-[100px] text-right font-bold" size="sm">
            {t("rsshub.table.userLimit")}
          </TableHead>
          <TableCell className="w-[100px]" size="sm" />
        </TableRow>
      </TableHeader>
      <TableBody className="border-t-[12px] border-transparent [&_td]:!px-3">
        <TableRow>
          <TableCell className="text-nowrap font-bold">{t("rsshub.table.official")}</TableCell>
          <TableCell>
            <span className="flex items-center gap-2">
              <Logo className="size-6" />
              Follow
            </span>
          </TableCell>
          <TableCell>Follow Built-in RSSHub</TableCell>
          <TableCell>
            <span className="flex items-center justify-end gap-1">
              0 <i className="i-mgc-power text-accent" />
            </span>
          </TableCell>
          <TableCell className="text-right">*</TableCell>
          <TableCell className="text-right">{t("rsshub.table.unlimited")}</TableCell>
          <TableCell>
            {!status?.data?.usage?.rsshubId && (
              <Button disabled className="shrink-0">
                {t("rsshub.table.inuse")}
              </Button>
            )}
            {!!status?.data?.usage?.rsshubId && (
              <Button onClick={() => presetTOTPModal({ id: null })}>{t("rsshub.table.use")}</Button>
            )}
          </TableCell>
        </TableRow>
        {data?.map((instance) => {
          return (
            <TableRow key={instance.id}>
              <TableCell className="text-nowrap">
                {(() => {
                  const flag: string[] = []
                  if (status?.data?.usage?.rsshubId === instance.id) {
                    flag.push(t("rsshub.table.inuse"))
                  }
                  if (instance.ownerUserId === me?.id) {
                    flag.push(t("rsshub.table.yours"))
                  }
                  return flag.join(" / ")
                })()}
              </TableCell>
              <TableCell>
                <UserAvatar
                  userId={instance.ownerUserId}
                  className="h-auto justify-start p-0"
                  avatarClassName="size-6"
                />
              </TableCell>
              <TableCell>
                <EllipsisTextWithTooltip className="line-clamp-2">
                  {instance.description}
                </EllipsisTextWithTooltip>
              </TableCell>
              <TableCell>
                <span className="flex items-center justify-end gap-1">
                  {instance.price} <i className="i-mgc-power text-accent" />
                </span>
              </TableCell>
              <TableCell className="text-right">{instance.userCount}</TableCell>
              <TableCell className="text-right">
                {instance.userLimit === null
                  ? t("rsshub.table.unlimited")
                  : instance.userLimit > 1
                    ? instance.userLimit
                    : t("rsshub.table.private")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex w-max items-center gap-2">
                  <Button
                    className="shrink-0"
                    variant={status?.data?.usage?.rsshubId === instance.id ? "outline" : "primary"}
                    onClick={() => {
                      present({
                        title: t("rsshub.useModal.title"),
                        content: ({ dismiss }) => (
                          <SetModalContent dismiss={dismiss} instance={instance} />
                        ),
                      })
                    }}
                  >
                    {t(
                      status?.data?.usage?.rsshubId === instance.id
                        ? "rsshub.table.inuse"
                        : "rsshub.table.use",
                    )}
                  </Button>
                  {me?.id === instance.ownerUserId && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        present({
                          title: t("rsshub.table.edit"),
                          content: ({ dismiss }) => (
                            <AddModalContent dismiss={dismiss} instance={instance} />
                          ),
                        })
                      }
                    >
                      {t("rsshub.table.edit")}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
