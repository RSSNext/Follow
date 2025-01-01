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
import type { RSSHubModel } from "@follow/models"
import { useTranslation } from "react-i18next"

import RSSHubIcon from "~/assets/rsshub-icon.png"
import { whoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useAuthQuery } from "~/hooks/common"
import { useSubViewTitle } from "~/modules/app-layout/subview/hooks"
import { AddModalContent } from "~/modules/rsshub/add-modal-content"
import { SetModalContent } from "~/modules/rsshub/set-modal-content"
import { UserAvatar } from "~/modules/user/UserAvatar"
import { Queries } from "~/queries"
import { useSetRSSHubMutation } from "~/queries/rsshub"

export function Component() {
  const { t } = useTranslation("settings")
  const { present } = useModalStack()

  useSubViewTitle("words.rsshub")

  const list = useAuthQuery(Queries.rsshub.list())

  return (
    <div className="relative flex w-full max-w-4xl flex-col items-center gap-8 px-4 pb-8 lg:pb-4">
      <div className="motion-preset-shake center text-accent motion-delay-500">
        <img src={RSSHubIcon} className="mt-12 size-20" />
      </div>
      <div className="text-2xl font-bold">{t("words.rsshub", { ns: "common" })}</div>
      <div className="text-sm">{t("rsshub.description")}</div>
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
  const { present } = useModalStack()

  return (
    <Table containerClassName="mt-2">
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold" size="sm" />
          <TableHead className="font-bold" size="sm">
            {t("rsshub.table.owner")}
          </TableHead>
          <TableHead className="font-bold" size="sm">
            {t("rsshub.table.description")}
          </TableHead>
          <TableHead className="font-bold" size="sm">
            {t("rsshub.table.price")}
          </TableHead>
          <TableHead className="font-bold" size="sm">
            {t("rsshub.table.userCount")}
          </TableHead>
          <TableHead className="font-bold" size="sm">
            {t("rsshub.table.userLimit")}
          </TableHead>
          <TableCell size="sm" />
        </TableRow>
      </TableHeader>
      <TableBody className="border-t-[12px] border-transparent [&_td]:!px-3">
        <TableRow>
          <TableCell>Official</TableCell>
          <TableCell>
            <span className="flex items-center gap-2">
              <Logo className="size-6" />
              Follow
            </span>
          </TableCell>
          <TableCell>Follow Built-in RSSHub</TableCell>
          <TableCell>
            <span className="flex items-center gap-1">
              0 <i className="i-mgc-power text-accent" />
            </span>
          </TableCell>
          <TableCell>*</TableCell>
          <TableCell>{t("rsshub.table.unlimited")}</TableCell>
          <TableCell>
            {!status?.data?.usage?.rsshubId && (
              <Button disabled className="shrink-0">
                {t("rsshub.table.inuse")}
              </Button>
            )}
            {!!status?.data?.usage?.rsshubId && (
              <Button onClick={() => setRSSHubMutation.mutate({ id: null })}>
                {t("rsshub.table.use")}
              </Button>
            )}
          </TableCell>
        </TableRow>
        {data?.map((instance) => {
          return (
            <TableRow key={instance.id}>
              <TableCell>
                {(() => {
                  const flag: string[] = []
                  if (status?.data?.usage?.rsshubId === instance.id) {
                    flag.push("In use")
                  }
                  if (instance.ownerUserId === me?.id) {
                    flag.push("Yours")
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
                <div className="line-clamp-2">{instance.description}</div>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1">
                  {instance.price} <i className="i-mgc-power text-accent" />
                </span>
              </TableCell>
              <TableCell>{instance.userCount}</TableCell>
              <TableCell>{instance.userLimit || t("rsshub.table.unlimited")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
