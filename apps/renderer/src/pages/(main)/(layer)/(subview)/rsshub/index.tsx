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

import { whoami } from "~/atoms/user"
import { useAuthQuery } from "~/hooks/common"
import { useSubViewTitle } from "~/modules/app-layout/subview/hooks"
import { UserAvatar } from "~/modules/user/UserAvatar"
import { Queries } from "~/queries"

export function Component() {
  const { t } = useTranslation("settings")

  useSubViewTitle("words.rsshub")

  const list = useAuthQuery(Queries.rsshub.list())

  return (
    <div className="relative flex w-full flex-col items-center gap-8 px-4 pb-8 lg:pb-4">
      <div className="pt-12 text-2xl font-bold">{t("words.rsshub", { ns: "common" })}</div>
      <div className="text-sm text-muted-foreground">{t("rsshub.public_instances")}</div>
      <List data={list?.data} />
    </div>
  )
}

function List({ data }: { data?: RSSHubModel[] }) {
  const { t } = useTranslation("settings")
  const me = whoami()

  return (
    <Table containerClassName="mt-2 max-w-4xl">
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
          <TableCell>Unlimited</TableCell>
          <TableCell>
            <span className="flex items-center gap-2">
              <Button>{t("rsshub.table.use")}</Button>
            </span>
          </TableCell>
        </TableRow>
        {data?.map((instance, index) => {
          return (
            <TableRow key={instance.id}>
              <TableCell>
                {(() => {
                  const flag: string[] = []
                  if (index === 0) {
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
              <TableCell>{instance.description}</TableCell>
              <TableCell>
                <span className="flex items-center gap-1">
                  {instance.price} <i className="i-mgc-power text-accent" />
                </span>
              </TableCell>
              <TableCell>{instance.userCount}</TableCell>
              <TableCell>{instance.userLimit || t("rsshub.table.unlimited")}</TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  {index === 0 && <Button disabled>{t("rsshub.table.inuse")}</Button>}
                  {index !== 0 && <Button>{t("rsshub.table.use")}</Button>}
                  {me?.id === instance.ownerUserId && (
                    <Button variant="outline">{t("rsshub.table.edit")}</Button>
                  )}
                </span>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
