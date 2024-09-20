import { WEB_URL } from "@follow/shared/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { Avatar, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Card, CardHeader } from "~/components/ui/card"
import { Divider } from "~/components/ui/divider"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
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
import { views } from "~/constants"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { cn } from "~/lib/utils"
import type { ListModel } from "~/models"
import { Queries } from "~/queries"
import { useFeedById } from "~/store/feed"

export const SettingLists = () => {
  const { t: appT } = useTranslation()
  const { t } = useTranslation("settings")
  const listList = useAuthQuery(Queries.lists.list())

  const { present } = useModalStack()

  return (
    <section className="mt-4">
      <div className="mb-4 space-y-2 text-sm">
        <p>{t("lists.info")}</p>
      </div>
      <Button
        onClick={() => {
          present({
            title: t("lists.create"),
            content: ({ dismiss }) => <ListCreationModalContent dismiss={dismiss} />,
          })
        }}
      >
        <i className="i-mgc-add-cute-re mr-1 text-base" />
        {t("lists.create")}
      </Button>
      <Divider className="mb-6 mt-8" />
      <div className="flex flex-1 flex-col">
        <ScrollArea.ScrollArea viewportClassName="max-h-[380px]">
          {listList.data?.length ? (
            <Table className="mt-4">
              <TableHeader className="border-b">
                <TableRow className="[&_*]:!font-semibold">
                  <TableHead className="text-center" size="sm">
                    {t("lists.title")}
                  </TableHead>
                  <TableHead className="w-28 text-center" size="sm">
                    {t("lists.view")}
                  </TableHead>
                  <TableHead className="w-48 text-center" size="sm">
                    {t("lists.fee")}
                  </TableHead>
                  <TableHead className="w-20 text-center" size="sm">
                    {t("lists.edit")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-t-[12px] border-transparent">
                {listList.data?.map((row) => (
                  <TableRow key={row.title} className="h-8">
                    <TableCell size="sm">
                      <a
                        target="_blank"
                        href={`${WEB_URL}/list/${row.id}`}
                        className="flex items-center justify-center gap-2 font-semibold"
                      >
                        {row.image && (
                          <Avatar className="size-6">
                            <AvatarImage src={row.image} />
                          </Avatar>
                        )}
                        <span className="inline-block max-w-[200px] truncate">{row.title}</span>
                      </a>
                    </TableCell>
                    <TableCell align="center" size="sm">
                      <div className="flex items-center justify-center gap-1">
                        <span className={cn("inline-flex items-center", views[row.view].className)}>
                          {views[row.view].icon}
                        </span>
                        {appT(views[row.view].name)}
                      </div>
                    </TableCell>
                    <TableCell align="center" size="sm">
                      <div className="flex items-center justify-center gap-1">
                        {row.fee}
                        <i className="i-mgc-power shrink-0 text-lg text-accent" />
                      </div>
                    </TableCell>
                    <TableCell align="center" size="sm">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          present({
                            title: t("lists.edit"),
                            content: ({ dismiss }) => (
                              <ListCreationModalContent dismiss={dismiss} id={row.id} />
                            ),
                          })
                        }}
                      >
                        <i className="i-mgc-edit-cute-re" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : listList.isLoading ? (
            <LoadingCircle size="large" className="center absolute inset-0" />
          ) : (
            <div className="mt-36 w-full text-center text-sm text-zinc-400">
              <p>{t("lists.noLists")}</p>
            </div>
          )}
        </ScrollArea.ScrollArea>
      </div>
    </section>
  )
}

const formSchema = z.object({
  view: z.string(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  fee: z.number().min(0),
})

const ListCreationModalContent = ({ dismiss, id }: { dismiss: () => void; id?: string }) => {
  const { t: appT } = useTranslation()
  const { t } = useTranslation("settings")

  const list = useFeedById(id) as ListModel

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      view: list?.view.toString() || views[0].view.toString(),
      fee: list?.fee || 0,
      title: list?.title || "",
      description: list?.description || "",
      image: list?.image || "",
    },
  })

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (id) {
        await apiClient.lists.$patch({
          json: {
            listId: id,
            ...values,
            view: Number.parseInt(values.view),
          },
        })
      } else {
        await apiClient.lists.$post({
          json: {
            ...values,
            view: Number.parseInt(values.view),
          },
        })
      }
    },
    onSuccess: () => {
      toast.success(t(id ? "lists.edit.success" : "lists.created.success"))
      Queries.lists.list().invalidate()
      dismiss()
    },
    async onError() {
      toast.error(t(id ? "lists.edit.error" : "lists.created.error"))
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>
                  {t("lists.title")}
                  <sup className="ml-1 align-sub text-red-500">*</sup>
                </FormLabel>
              </div>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>{t("lists.description")}</FormLabel>
              </div>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <FormItem className="w-full">
                <FormLabel>{t("lists.image")}</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input {...field} />
                    {field.value && (
                      <Avatar className="size-9">
                        <AvatarImage src={field.value} />
                      </Avatar>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="view"
          render={() => (
            <FormItem>
              <FormLabel>{t("lists.view")}</FormLabel>
              <Card>
                <CardHeader className="grid grid-cols-6 space-y-0 px-2 py-3">
                  {views.map((view) => (
                    <div key={view.name}>
                      <input
                        className="peer hidden"
                        type="radio"
                        id={view.name}
                        value={view.view}
                        {...form.register("view")}
                      />
                      <label
                        htmlFor={view.name}
                        className={cn(
                          view.peerClassName,
                          "center flex h-10 flex-col text-xs leading-none text-theme-vibrancyFg",
                        )}
                      >
                        <span className="text-lg">{view.icon}</span>
                        {appT(view.name)}
                      </label>
                    </div>
                  ))}
                </CardHeader>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>{t("lists.fee")}</FormLabel>
                <FormDescription>{t("lists.fee.description")}</FormDescription>
              </div>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    {...field}
                    type="number"
                    onChange={(value) => field.onChange(value.target.valueAsNumber)}
                  />
                  <i className="i-mgc-power ml-4 shrink-0 text-xl text-accent" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={createMutation.isPending}>
          {t("lists.submit")}
        </Button>
      </form>
    </Form>
  )
}
