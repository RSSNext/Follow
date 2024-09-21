import { WEB_URL } from "@follow/shared/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { FeedCertification } from "~/components/feed-certification"
import { FeedIcon } from "~/components/feed-icon"
import type { Suggestion } from "~/components/ui/auto-completion"
import { Autocomplete } from "~/components/ui/auto-completion"
import { Avatar, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
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
import { useAuthQuery, useI18n } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { cn, isBizId } from "~/lib/utils"
import type { ListModel } from "~/models"
import { ViewSelectorRadioGroup } from "~/modules/shared/ViewSelectorRadioGroup"
import { Queries } from "~/queries"
import { feedActions, getFeedById, useFeedById } from "~/store/feed"
import { useSubscriptionStore } from "~/store/subscription"

export const SettingLists = () => {
  // const { t: appT } = useTranslation()
  const t = useI18n()
  // const { t } = useTranslation("settings")
  const listList = useAuthQuery(Queries.lists.list())

  const { present } = useModalStack()

  return (
    <section className="mt-4">
      <div className="mb-4 space-y-2 text-sm">
        <p>{t.settings("lists.info")}</p>
      </div>
      <Button
        onClick={() => {
          present({
            title: t.settings("lists.create"),
            content: ({ dismiss }) => <ListCreationModalContent dismiss={dismiss} />,
          })
        }}
      >
        <i className="i-mgc-add-cute-re mr-1 text-base" />
        {t.settings("lists.create")}
      </Button>
      <Divider className="mb-6 mt-8" />
      <div className="flex flex-1 flex-col">
        <ScrollArea.ScrollArea viewportClassName="max-h-[380px]">
          {listList.data?.length ? (
            <Table className="mt-4">
              <TableHeader className="border-b">
                <TableRow className="[&_*]:!font-semibold">
                  <TableHead className="text-center" size="sm">
                    {t.settings("lists.title")}
                  </TableHead>
                  <TableHead className="w-28 text-center" size="sm">
                    {t.settings("lists.view")}
                  </TableHead>
                  <TableHead className="w-20 text-center" size="sm">
                    {t.settings("lists.fee")}
                  </TableHead>
                  <TableHead className="w-20 text-center" size="sm">
                    {t.settings("lists.feeds")}
                  </TableHead>
                  <TableHead className="w-20 text-center" size="sm">
                    {t.settings("lists.edit")}
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
                        {t(views[row.view].name)}
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
                            title: t.settings("lists.feeds.manage"),
                            content: () => <ListFeedsModalContent id={row.id} />,
                          })
                        }}
                      >
                        <i className="i-mgc-inbox-cute-re" />
                      </Button>
                    </TableCell>
                    <TableCell align="center" size="sm">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          present({
                            title: t.settings("lists.edit"),
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
              <p>{t.settings("lists.noLists")}</p>
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
  const { t } = useTranslation("settings")

  const appT = useI18n()

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[450px] space-y-4">
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

              <ViewSelectorRadioGroup {...form.register("view")} />
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
        <div className="flex justify-end">
          <Button type="submit" isLoading={createMutation.isPending}>
            {id ? appT.common("words.update") : appT.common("words.create")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export const ListFeedsModalContent = ({ id }: { id: string }) => {
  const list = useFeedById(id) as ListModel
  const { t } = useTranslation("settings")

  const [feedSearchFor, setFeedSearchFor] = useState("")
  const addMutation = useMutation({
    mutationFn: async (values: string) => {
      const feed = await apiClient.lists.feeds.$post({
        json: {
          listId: id,
          feedId: values,
        },
      })
      feedActions.upsertMany([feed.data])
    },
    onSuccess: () => {
      toast.success(t("lists.feeds.add.success"))
      Queries.lists.list().invalidate()
    },
    async onError() {
      toast.error(t("lists.feeds.add.error"))
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (feedId: string) => {
      await apiClient.lists.feeds.$delete({
        json: {
          listId: id,
          feedId,
        },
      })
    },
    onSuccess: () => {
      toast.success(t("lists.feeds.delete.success"))
      Queries.lists.list().invalidate()
    },
    async onError() {
      toast.error(t("lists.feeds.delete.error"))
    },
  })

  const allFeeds = useSubscriptionStore((store) => {
    const feedInfo = [] as { title: string; id: string }[]

    const allSubscriptions = Object.values(store.feedIdByView).flat()

    for (const feedId of allSubscriptions) {
      const subscription = store.data[feedId]
      const feed = getFeedById(feedId)
      if (feed && feed.type === "feed") {
        feedInfo.push({ title: subscription.title || feed.title || "", id: feed.id })
      }
    }
    return feedInfo
  })

  const autocompleteSuggestions: Suggestion[] = useMemo(() => {
    return allFeeds.map((feed) => ({
      name: feed.title,
      value: feed.id,
    }))
  }, [allFeeds])

  const selectedFeedIdRef = useRef<string | null>()
  return (
    <>
      <div className="flex items-center gap-2">
        <Autocomplete
          maxHeight={window.innerHeight < 600 ? 120 : 240}
          value={feedSearchFor}
          searchKeys={["name"]}
          onSuggestionSelected={(e) => {
            selectedFeedIdRef.current = e?.value
            setFeedSearchFor(e?.name || "")
          }}
          onChange={(e) => {
            setFeedSearchFor(e.target.value)
          }}
          suggestions={autocompleteSuggestions}
         />
        <Button
          onClick={() => {
            if (isBizId(feedSearchFor)) {
              addMutation.mutate(feedSearchFor)
              return
            }
            if (selectedFeedIdRef.current) {
              addMutation.mutate(selectedFeedIdRef.current)
            }
          }}
        >
          {t("lists.feeds.add")}
        </Button>
      </div>
      <Divider className="mt-8" />
      <ScrollArea.ScrollArea viewportClassName="max-h-[380px] w-[450px]">
        <Table className="mt-4">
          <TableHeader className="border-b">
            <TableRow className="[&_*]:!font-semibold">
              {/* <TableHead className="w-20 text-center" size="sm">
                {t("lists.feeds.id")}
              </TableHead> */}
              <TableHead className="text-center" size="sm">
                {t("lists.feeds.title")}
              </TableHead>
              <TableHead className="w-20 text-center" size="sm">
                {t("lists.feeds.owner")}
              </TableHead>
              <TableHead className="w-20 text-center" size="sm">
                {t("lists.feeds.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-t-[12px] border-transparent">
            {list.feeds?.map((row) => (
              <TableRow key={row.title} className="h-8">
                {/* <TableCell align="center" size="sm">
                  {row.id}
                </TableCell> */}
                <TableCell align="center" size="sm">
                  <a
                    target="_blank"
                    href={`${WEB_URL}/list/${row.id}`}
                    className="flex items-center justify-center gap-2 font-semibold"
                  >
                    {row.siteUrl && <FeedIcon className="mr-0" siteUrl={row.siteUrl} />}
                    <span className="inline-block max-w-[200px] truncate">{row.title}</span>
                  </a>
                </TableCell>
                <TableCell align="center" size="sm">
                  <FeedCertification className="ml-0" feed={row} />
                </TableCell>
                <TableCell align="center" size="sm">
                  <Button variant="ghost" onClick={() => removeMutation.mutate(row.id)}>
                    <i className="i-mgc-delete-2-cute-re" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea.ScrollArea>
    </>
  )
}
