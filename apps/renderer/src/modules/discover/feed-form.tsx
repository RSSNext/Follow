import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { FollowSummary } from "~/components/feed-summary"
import { Logo } from "~/components/icons/logo"
import { Autocomplete } from "~/components/ui/auto-completion"
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
import { views } from "~/constants"
import { useDeleteSubscription } from "~/hooks/biz/useSubscriptionActions"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { tipcClient } from "~/lib/client"
import { FeedViewType } from "~/lib/enum"
import { getFetchErrorMessage, toastFetchError } from "~/lib/error-parser"
import { getNewIssueUrl } from "~/lib/issues"
import { cn } from "~/lib/utils"
import { feed as feedQuery, useFeed } from "~/queries/feed"
import { subscription as subscriptionQuery } from "~/queries/subscriptions"
import { useFeedByIdOrUrl } from "~/store/feed"
import { useSubscriptionByFeedId } from "~/store/subscription"
import { feedUnreadActions } from "~/store/unread"

const formSchema = z.object({
  view: z.string(),
  category: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
  title: z.string().optional(),
})

const defaultValue = { view: FeedViewType.Articles.toString() } as z.infer<typeof formSchema>
export const FeedForm: Component<{
  url?: string
  id?: string

  defaultValues?: z.infer<typeof formSchema>

  asWidget?: boolean

  onSuccess?: () => void
}> = ({ id: _id, defaultValues = defaultValue, url, asWidget, onSuccess }) => {
  const queryParams = { id: _id, url }
  const feedQuery = useFeed(queryParams)

  const id = feedQuery.data?.feed.id || _id
  const feed = useFeedByIdOrUrl({
    id,
    url,
  })

  const hasSub = useSubscriptionByFeedId(feed?.id || "")
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

      {feed ? (
        <FeedInnerForm {...{ defaultValues, id, url, asWidget, onSuccess }} />
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
                      "Feed URL:",
                      "```",
                      url,
                      "```",
                      "",
                      "Error:",
                      "```",
                      getFetchErrorMessage(feedQuery.error),
                      "```",
                    ].join("\n"),
                    title: `Error in fetching feed: ${id ?? url}`,
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
          <p>{url}</p>
        </div>
      )}
    </div>
  )
}

const FeedInnerForm = ({
  defaultValues,
  id,
  url,
  asWidget,
  onSuccess,
}: {
  defaultValues?: z.infer<typeof formSchema>
  url?: string
  id?: string
  asWidget?: boolean
  onSuccess?: () => void
}) => {
  const subscription = useSubscriptionByFeedId(id || "")
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isSubscribed = !!subscription
  const feed = useFeedByIdOrUrl({ id, url })!

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { setClickOutSideToDismiss } = useCurrentModal()

  useEffect(() => {
    setClickOutSideToDismiss(!form.formState.isDirty)
  }, [form.formState.isDirty])

  useEffect(() => {
    if (subscription) {
      form.setValue("view", `${subscription?.view}`)
      subscription?.category && form.setValue("category", subscription.category)
      form.setValue("isPrivate", subscription?.isPrivate || false)
      form.setValue("title", subscription?.title || "")
    }
  }, [subscription])

  const followMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const body = {
        url: feed.url,
        view: Number.parseInt(values.view),
        category: values.category,
        isPrivate: values.isPrivate,
        title: values.title,
        ...(isSubscribed && { feedId: feed.id }),
      }
      const $method = isSubscribed ? apiClient.subscriptions.$patch : apiClient.subscriptions.$post

      return $method({
        // @ts-expect-error
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

      const feedId = feed.id
      if (feedId) {
        feedQuery.byId({ id: feedId }).invalidate()
        tipcClient?.invalidateQuery(feedQuery.byId({ id: feedId }).key)
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

  const deleteSubscription = useDeleteSubscription({
    onSuccess: () => {
      if (!asWidget && !isSubscribed) {
        window.close()
      }

      onSuccess?.()
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    followMutation.mutate(values)
  }

  const { t } = useTranslation()

  const categories = useAuthQuery(subscriptionQuery.categories())

  // useEffect(() => {
  //   if (feed.isSuccess) nextFrame(() => buttonRef.current?.focus());
  // }, [feed.isSuccess]);

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <Card>
        <CardHeader>
          <FollowSummary feed={feed} />
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
                            "center flex h-10 flex-col text-xs leading-none opacity-80 duration-200 hover:opacity-90",
                            "peer-checked:opacity-100",
                            "whitespace-nowrap",
                          )}
                        >
                          <span className="text-lg">{view.icon}</span>
                          {t(view.name)}
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>{t("feed_form.category")}</FormLabel>
                  <FormDescription>{t("feed_form.category_description")}</FormDescription>
                </div>
                <FormControl>
                  <div>
                    <Autocomplete
                      maxHeight={window.innerHeight < 600 ? 120 : 240}
                      portal
                      suggestions={
                        categories.data?.map((i) => ({
                          name: i,
                          value: i,
                        })) || []
                      }
                      {...(field as any)}
                      onSuggestionSelected={(suggestion) => {
                        field.onChange(suggestion.value)
                      }}
                    />
                  </div>
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

          <div className="flex flex-1 items-end justify-end gap-4">
            {isSubscribed && (
              <Button
                type="button"
                ref={buttonRef}
                variant="text"
                isLoading={deleteSubscription.isPending}
                className="text-red-500"
                onClick={(e) => {
                  e.preventDefault()
                  if (subscription) {
                    deleteSubscription.mutate(subscription)
                  }
                }}
              >
                {t("feed_form.unfollow")}
              </Button>
            )}
            <Button ref={buttonRef} type="submit" isLoading={followMutation.isPending}>
              {isSubscribed ? t("feed_form.update") : t("feed_form.follow")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
