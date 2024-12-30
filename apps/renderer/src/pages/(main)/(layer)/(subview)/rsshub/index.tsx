import { Logo } from "@follow/components/icons/logo.jsx"
import { Button } from "@follow/components/ui/button/index.js"
import { Card, CardContent } from "@follow/components/ui/card/index.js"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@follow/components/ui/form/index.jsx"
import { Input } from "@follow/components/ui/input/Input.js"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@follow/components/ui/table/index.jsx"
import type { RSSHubModel } from "@follow/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { whoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useAuthQuery } from "~/hooks/common"
import { useSubViewTitle } from "~/modules/app-layout/subview/hooks"
import { UserAvatar } from "~/modules/user/UserAvatar"
import { Queries } from "~/queries"
import { useSetRSSHubMutation } from "~/queries/rsshub"

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
  const status = useAuthQuery(Queries.rsshub.status())
  const setRSSHubMutation = useSetRSSHubMutation()
  const { present } = useModalStack()

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
                    <Button variant="outline">{t("rsshub.table.edit")}</Button>
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

const SetModalContent = ({ dismiss, instance }: { dismiss: () => void; instance: RSSHubModel }) => {
  const { t } = useTranslation("settings")
  const setRSSHubMutation = useSetRSSHubMutation()
  const details = useAuthQuery(Queries.rsshub.get({ id: instance.id }))
  const hasPurchase = !!details.data?.purchase

  const formSchema = z.object({
    months: z.coerce
      .number()
      .min(hasPurchase ? 0 : 1)
      .max(12),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      months: hasPurchase ? 0 : 1,
    },
  })

  const months = form.watch("months")

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setRSSHubMutation.mutate({ id: instance.id, durationInMonths: data.months })
  }

  useEffect(() => {
    if (setRSSHubMutation.isSuccess) {
      dismiss()
    }
  }, [setRSSHubMutation.isSuccess])

  return (
    <div className="max-w-[550px] space-y-4 lg:min-w-[550px]">
      <Card>
        <CardContent className="max-w-2xl space-y-2 p-6">
          <div className="mb-3 text-lg font-medium">{t("rsshub.useModal.about")}</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{t("rsshub.table.owner")}</div>
            <UserAvatar
              userId={instance.ownerUserId}
              className="h-auto justify-start p-0"
              avatarClassName="size-6"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{t("rsshub.table.description")}</div>
            <div className="line-clamp-2">{instance.description}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{t("rsshub.table.price")}</div>
            <div className="line-clamp-2 flex items-center gap-1">
              {instance.price} <i className="i-mgc-power text-accent" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{t("rsshub.table.userCount")}</div>
            <div className="line-clamp-2">{instance.userCount}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{t("rsshub.table.userLimit")}</div>
            <div className="line-clamp-2">{instance.userLimit || t("rsshub.table.unlimited")}</div>
          </div>
        </CardContent>
      </Card>
      {details.data?.purchase && (
        <div>
          <div className="text-sm text-muted-foreground">
            {t("rsshub.useModal.purchase_expires_at")}
          </div>
          <div className="line-clamp-2">
            {new Date(details.data.purchase.expiresAt).toLocaleString()}
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {instance.price > 0 && (
            <FormField
              control={form.control}
              name="months"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rsshub.useModal.months_label")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-10">
                      <div className="space-x-2">
                        <Input className="w-24" type="number" max={12} {...field} />
                        <span className="text-sm text-muted-foreground">
                          {t("rsshub.useModal.month")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {instance.price * field.value}
                        <i className="i-mgc-power text-accent" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex items-center justify-end">
            <Button type="submit" isLoading={setRSSHubMutation.isPending}>
              {instance.price
                ? t("rsshub.useModal.useWith", {
                    amount: instance.price * months,
                  })
                : t("rsshub.table.use")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
