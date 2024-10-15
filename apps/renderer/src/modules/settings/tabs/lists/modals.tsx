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
import { useCurrentModal } from "~/components/ui/modal"
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
import { apiClient } from "~/lib/api-fetch"
import { createErrorToaster } from "~/lib/error-parser"
import { UrlBuilder } from "~/lib/url-builder"
import { isBizId } from "~/lib/utils"
import type { FeedModel } from "~/models"
import { ViewSelectorRadioGroup } from "~/modules/shared/ViewSelectorRadioGroup"
import { Queries } from "~/queries"
import {
  getFeedById,
  useAddFeedToFeedList,
  useFeedById,
  useRemoveFeedFromFeedList,
} from "~/store/feed"
import { useListById } from "~/store/list"
import { subscriptionActions, useSubscriptionStore } from "~/store/subscription"

const formSchema = z.object({
  view: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  fee: z.number().min(0),
})

export const ListCreationModalContent = ({ id }: { id?: string }) => {
  const { dismiss } = useCurrentModal()
  const { t } = useTranslation(["settings", "common"])

  const list = useListById(id)

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
    onSuccess: (_, values) => {
      toast.success(t(id ? "lists.edit.success" : "lists.created.success"))
      Queries.lists.list().invalidate()
      dismiss()

      if (!list) return
      if (id) subscriptionActions.changeListView(id, views[list.view].view, views[values.view].view)
    },
    onError: createErrorToaster(id ? t("lists.edit.error") : t("lists.created.error")),
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
                <Input autoFocus {...field} />
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
                <FormLabel>{t("lists.fee.label")}</FormLabel>
                <FormDescription>{t("lists.fee.description")}</FormDescription>
              </div>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    {...field}
                    type="number"
                    min={0}
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
            {id ? t("common:words.update") : t("common:words.create")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export const ListFeedsModalContent = ({ id }: { id: string }) => {
  const list = useListById(id)
  const { t } = useTranslation("settings")

  const [feedSearchFor, setFeedSearchFor] = useState("")
  const addMutation = useAddFeedToFeedList({
    onSuccess: () => {
      setFeedSearchFor("")
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
    return allFeeds
      .filter((feed) => !list?.feedIds?.includes(feed.id))
      .map((feed) => ({
        name: feed.title,
        value: feed.id,
      }))
  }, [allFeeds, list?.feedIds])

  const selectedFeedIdRef = useRef<string | null>()
  if (!list) return null
  return (
    <>
      <div className="flex items-center gap-2">
        <Autocomplete
          maxHeight={window.innerHeight < 600 ? 120 : 240}
          autoFocus
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
          className="whitespace-nowrap"
          onClick={() => {
            if (isBizId(feedSearchFor)) {
              addMutation.mutate({ feedId: feedSearchFor, listId: id })
              return
            }
            if (selectedFeedIdRef.current) {
              addMutation.mutate({ feedId: selectedFeedIdRef.current, listId: id })
            }
          }}
        >
          {t("lists.feeds.add.label")}
        </Button>
      </div>
      <Divider className="mt-8" />
      <ScrollArea.ScrollArea viewportClassName="max-h-[380px] w-[450px]">
        <Table className="mt-4">
          <TableHeader className="border-b">
            <TableRow className="[&_*]:!font-semibold">
              <TableHead size="sm" className="pl-8">
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
            {list.feedIds?.map((feedId) => <RowRender feedId={feedId} key={feedId} listId={id} />)}
          </TableBody>
        </Table>
      </ScrollArea.ScrollArea>
    </>
  )
}

const RowRender = ({ feedId, listId }: { feedId: string; listId: string }) => {
  const feed = useFeedById(feedId) as FeedModel

  const removeMutation = useRemoveFeedFromFeedList()
  if (!feed) return null
  return (
    <TableRow key={feed.title} className="h-8">
      <TableCell size="sm">
        <a
          target="_blank"
          href={UrlBuilder.shareList(feed.id)}
          className="flex items-center gap-2 font-semibold"
        >
          {feed.siteUrl && <FeedIcon className="mr-0" siteUrl={feed.siteUrl} />}
          <span className="inline-block max-w-[200px] truncate">{feed.title}</span>
        </a>
      </TableCell>
      <TableCell align="center" size="sm">
        <div className="center">
          <FeedCertification className="ml-0" feed={feed} />
        </div>
      </TableCell>
      <TableCell align="center" size="sm">
        <Button variant="ghost" onClick={() => removeMutation.mutate({ feedId: feed.id, listId })}>
          <i className="i-mgc-delete-2-cute-re" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
