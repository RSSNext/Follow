import { zodResolver } from "@hookform/resolvers/zod"
import { FollowSummary } from "@renderer/components/feed-summary"
import { Logo } from "@renderer/components/icons/logo"
import { Autocomplete } from "@renderer/components/ui/auto-completion"
import { Button } from "@renderer/components/ui/button"
import { Card, CardHeader } from "@renderer/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { Switch } from "@renderer/components/ui/switch"
import { views } from "@renderer/constants"
import { useDeleteSubscription } from "@renderer/hooks/biz/useSubscriptionActions"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient, getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { tipcClient } from "@renderer/lib/client"
import { FeedViewType } from "@renderer/lib/enum"
import { getNewIssueUrl } from "@renderer/lib/issues"
import { cn } from "@renderer/lib/utils"
import { Queries } from "@renderer/queries"
import { useFeed } from "@renderer/queries/feed"
import { useFeedByIdOrUrl } from "@renderer/store/feed"
import { useSubscriptionByFeedId } from "@renderer/store/subscription"
import { feedUnreadActions } from "@renderer/store/unread"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
}> = ({ id, defaultValues = defaultValue, url, asWidget, onSuccess }) => {
  const queryParams = { id, url }
  const feedQuery = useFeed(queryParams)

  const feed = useFeedByIdOrUrl(queryParams)

  const hasSub = useSubscriptionByFeedId(feed?.id || "")
  const isSubscribed = !!feedQuery.data?.subscription || hasSub

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
          {isSubscribed ? "Update" : "Add"} follow
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
          <p>Error in fetching feed.</p>
          <p className="break-all px-8 text-center">{getFetchErrorMessage(feedQuery.error)}</p>

          <div className="flex items-center gap-4">
            <Button
              variant="text"
              onClick={() => {
                feedQuery.refetch()
              }}
            >
              Retry
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
              Fallback
            </Button>
          </div>
        </div>
      ) : (
        <div className="center h-full grow flex-col">
          <i className="i-mgc-question-cute-re mb-6 size-12 text-zinc-500" />
          <p>Feed not found.</p>
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
        Queries.subscription.byView(subscription?.view).invalidate()
        tipcClient?.invalidateQuery(Queries.subscription.byView(subscription?.view).key)
        feedUnreadActions.fetchUnreadByView(subscription?.view)
      }
      Queries.subscription.byView(Number.parseInt(variables.view)).invalidate()
      tipcClient?.invalidateQuery(Queries.subscription.byView(Number.parseInt(variables.view)).key)
      feedUnreadActions.fetchUnreadByView(Number.parseInt(variables.view))

      const feedId = feed.id
      if (feedId) {
        Queries.feed.byId({ id: feedId }).invalidate()
        tipcClient?.invalidateQuery(Queries.feed.byId({ id: feedId }).key)
      }
      toast(isSubscribed ? "🎉 Updated." : "🎉 Followed.", {
        duration: 1000,
      })

      if (!asWidget && !isSubscribed) {
        window.close()
      }

      onSuccess?.()
    },
    async onError(err) {
      toast.error(getFetchErrorMessage(err))
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

  const categories = useAuthQuery(
    Queries.subscription.categories(Number.parseInt(form.watch("view"))),
  )

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
                <FormLabel>View</FormLabel>
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
                          {view.name}
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
                  <FormLabel>Tile</FormLabel>
                  <FormDescription>
                    Custom title for this Feed. Leave empty to use the default.
                  </FormDescription>
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
                  <FormLabel>Category</FormLabel>
                  <FormDescription>
                    By default, your follows will be grouped by website.
                  </FormDescription>
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
                    <FormLabel>Private Follow</FormLabel>
                    <FormDescription>
                      Whether this follow is publicly visible on your profile page.
                    </FormDescription>
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
                Unfollow
              </Button>
            )}
            <Button ref={buttonRef} type="submit" isLoading={followMutation.isPending}>
              {isSubscribed ? "Update" : "Follow"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
