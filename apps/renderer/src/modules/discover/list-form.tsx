import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { FollowSummary } from "~/components/feed-summary"
import { Logo } from "~/components/icons/logo"
import { Button } from "~/components/ui/button"
import { Card, CardHeader } from "~/components/ui/card"
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
import { useCurrentModal } from "~/components/ui/modal"
import { Switch } from "~/components/ui/switch"
import { useI18n } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { tipcClient } from "~/lib/client"
import { FeedViewType } from "~/lib/enum"
import { getFetchErrorMessage, toastFetchError } from "~/lib/error-parser"
import { getNewIssueUrl } from "~/lib/issues"
import { cn } from "~/lib/utils"
import type { ListModel } from "~/models"
import { lists as listsQuery, useList } from "~/queries/lists"
import { subscription as subscriptionQuery } from "~/queries/subscriptions"
import { useListById } from "~/store/list"
import { useSubscriptionByFeedId } from "~/store/subscription"
import { feedUnreadActions } from "~/store/unread"

import { ViewSelectorRadioGroup } from "../shared/ViewSelectorRadioGroup"

const formSchema = z.object({
  view: z.string(),
  category: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
  title: z.string().optional(),
})

const defaultValue = { view: FeedViewType.Articles.toString() } as z.infer<typeof formSchema>

export type ListFormDataValuesType = z.infer<typeof formSchema>
export const ListForm: Component<{
  id?: string

  defaultValues?: ListFormDataValuesType

  asWidget?: boolean

  onSuccess?: () => void
}> = ({ id: _id, defaultValues = defaultValue, asWidget, onSuccess }) => {
  const queryParams = { id: _id }

  const feedQuery = useList(queryParams)

  const id = feedQuery.data?.list.id || _id
  const list = useListById(id)

  const hasSub = useSubscriptionByFeedId(list?.id || "")
  const isSubscribed = !!feedQuery.data?.subscription || hasSub

  const { t } = useTranslation()

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        asWidget ? "min-h-[420px] w-[550px] max-w-full" : "px-[18px] pb-[18px] pt-12",
      )}
    >
      {!asWidget && (
        <div className="mb-4 mt-2 flex items-center gap-2 text-[22px] font-bold">
          <Logo className="size-8" />
          {isSubscribed ? t("feed_form.update_follow") : t("feed_form.add_follow")}
        </div>
      )}

      {list ? (
        <ListInnerForm
          {...{
            defaultValues,
            id,
            asWidget,
            onSuccess,
            subscriptionData: feedQuery.data?.subscription,
            list,
          }}
        />
      ) : feedQuery.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingCircle size="large" />
        </div>
      ) : feedQuery.error ? (
        <div className="center grow flex-col gap-3">
          <i className="i-mgc-close-cute-re size-7 text-red-500" />
          <p>{t("feed_form.error_fetching_feed")}</p>
          <p className="cursor-text select-text break-all px-8 text-center">
            {getFetchErrorMessage(feedQuery.error)}
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="text"
              onClick={() => {
                feedQuery.refetch()
              }}
            >
              {t("feed_form.retry")}
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                window.open(
                  getNewIssueUrl({
                    body: [
                      "### Info:",
                      "",
                      "List ID:",
                      "```",
                      id,
                      "```",
                      "",
                      "Error:",
                      "```",
                      getFetchErrorMessage(feedQuery.error),
                      "```",
                    ].join("\n"),
                    title: `Error in fetching list: ${id}`,
                  }),
                  "_blank",
                )
              }}
            >
              {t("feed_form.feedback")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="center h-full grow flex-col">
          <i className="i-mgc-question-cute-re mb-6 size-12 text-zinc-500" />
          <p>{t("feed_form.feed_not_found")}</p>
          <p>{id}</p>
        </div>
      )}
    </div>
  )
}

const ListInnerForm = ({
  defaultValues,
  id,
  asWidget,
  onSuccess,
  subscriptionData,
  list,
}: {
  defaultValues?: z.infer<typeof formSchema>
  id?: string
  asWidget?: boolean
  onSuccess?: () => void
  subscriptionData?: {
    view?: number
    category?: string | null
    isPrivate?: boolean
    title?: string | null
  }
  list: ListModel
}) => {
  const subscription = useSubscriptionByFeedId(id || "") || subscriptionData
  const isSubscribed = !!subscription
  const buttonRef = useRef<HTMLButtonElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      view: list.view.toString(),
    },
  })

  const { setClickOutSideToDismiss, dismiss } = useCurrentModal()

  useEffect(() => {
    setClickOutSideToDismiss(!form.formState.isDirty)
  }, [form.formState.isDirty])

  useEffect(() => {
    if (subscription) {
      form.setValue("view", `${subscription?.view}`)
      form.setValue("isPrivate", subscription?.isPrivate || false)
      form.setValue("title", subscription?.title || "")
    }
  }, [subscription])

  const followMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const body = {
        listId: list.id,
        view: Number.parseInt(values.view),
        category: values.category,
        isPrivate: values.isPrivate,
        title: values.title,
      }
      const $method = isSubscribed ? apiClient.subscriptions.$patch : apiClient.subscriptions.$post

      return $method({
        json: body,
      })
    },
    onSuccess: (_, variables) => {
      if (isSubscribed && variables.view !== `${subscription?.view}`) {
        subscriptionQuery.byView(subscription?.view).invalidate()
        tipcClient?.invalidateQuery(subscriptionQuery.byView(subscription?.view).key)
        feedUnreadActions.fetchUnreadByView(subscription?.view)
      }
      subscriptionQuery.byView(Number.parseInt(variables.view)).invalidate()
      tipcClient?.invalidateQuery(subscriptionQuery.byView(Number.parseInt(variables.view)).key)
      feedUnreadActions.fetchUnreadByView(Number.parseInt(variables.view))

      const listId = list.id
      if (listId) {
        listsQuery.byId({ id: listId }).invalidate()
        tipcClient?.invalidateQuery(listsQuery.byId({ id: listId }).key)
      }
      toast(isSubscribed ? t("feed_form.updated") : t("feed_form.followed"), {
        duration: 1000,
      })

      if (!asWidget && !isSubscribed) {
        window.close()
      }

      onSuccess?.()
    },
    async onError(err) {
      toastFetchError(err)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    followMutation.mutate(values)
  }

  const t = useI18n()

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <Card>
        <CardHeader>
          <FollowSummary feed={list} />
        </CardHeader>
      </Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-y-4">
          <FormField
            control={form.control}
            name="view"
            render={() => (
              <FormItem>
                <FormLabel>{t("feed_form.view")}</FormLabel>

                <ViewSelectorRadioGroup
                  {...form.register("view")}
                  disabled={true}
                  className="opacity-60"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>{t("feed_form.title")}</FormLabel>
                  <FormDescription>{t("feed_form.title_description")}</FormDescription>
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
            name="isPrivate"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <div>
                    <FormLabel>{t("feed_form.private_follow")}</FormLabel>
                    <FormDescription>{t("feed_form.private_follow_description")}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      className="shrink-0"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          {!!list.fee && !isSubscribed && (
            <div>
              <FormLabel className="flex items-center gap-1">
                {t("feed_form.fee")}{" "}
                <div className="ml-2 flex scale-[0.85] items-center gap-1">
                  {list.fee}
                  <i className="i-mgc-power size-4 text-accent" />
                </div>
              </FormLabel>
              <FormDescription className="mt-0.5">{t("feed_form.fee_description")}</FormDescription>
            </div>
          )}
          <div className="flex flex-1 items-end justify-end gap-4">
            {isSubscribed && (
              <Button
                type="button"
                ref={buttonRef}
                variant="text"
                onClick={() => {
                  dismiss()
                }}
              >
                {t.common("cancel")}
              </Button>
            )}
            <Button ref={buttonRef} type="submit" isLoading={followMutation.isPending}>
              {isSubscribed
                ? t("feed_form.update")
                : list.fee
                  ? t("feed_form.follow_with_fee", {
                      fee: list.fee,
                    })
                  : t("feed_form.follow")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
