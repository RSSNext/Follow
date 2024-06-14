import { zodResolver } from "@hookform/resolvers/zod"
import { FollowSummary } from "@renderer/components/feed-summary"
import { Logo } from "@renderer/components/icons/logo"
import { Autocomplete } from "@renderer/components/ui/auto-completion"
import { StyledButton } from "@renderer/components/ui/button"
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
import { LoadingCircle } from "@renderer/components/ui/loading"
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { Switch } from "@renderer/components/ui/switch"
import { ViewSelectContent } from "@renderer/components/view-select-content"
import { useBizQuery } from "@renderer/hooks"
import { apiClient } from "@renderer/lib/api-fetch"
import { client } from "@renderer/lib/client"
import { FeedViewType } from "@renderer/lib/enum"
import { Queries } from "@renderer/queries"
import { useFeed } from "@renderer/queries/feed"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  view: z.string(),
  category: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
})

export const FeedForm: Component<{
  url?: string
  id?: string
  defaultView?: FeedViewType
}> = ({ id, defaultView = FeedViewType.Articles, url }) => {
  const feed = useFeed({
    url,
    id,
  })

  const isSubscribed = !!feed.data?.subscription
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      view: defaultView.toString(),
    },
  })

  useEffect(() => {
    if (feed.data?.subscription) {
      form.setValue("view", `${feed.data?.subscription?.view}`)
      form.setValue("category", feed.data?.subscription?.category)
      form.setValue("isPrivate", feed.data?.subscription?.isPrivate || false)
    }
  }, [feed.data?.subscription])

  const followMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const body = {
        url: feed.data?.feed.url,
        view: Number.parseInt(values.view),
        category: values.category,
        isPrivate: values.isPrivate,
        ...(isSubscribed && { feedId: feed.data?.feed.id }),
      }
      const $method = isSubscribed ?
        apiClient.subscriptions.$patch :
        apiClient.subscriptions.$post

      return $method({
        // @ts-expect-error
        json: body,
      })
    },
    onSuccess: (_, variables) => {
      if (
        isSubscribed &&
        variables.view !== `${feed.data?.subscription?.view}`
      ) {
        Queries.subscription.byView(feed.data?.subscription?.view).invalidate()
        client?.invalidateQuery(
          Queries.subscription.byView(feed.data?.subscription?.view).key,
        )
      }
      Queries.subscription.byView(Number.parseInt(variables.view)).invalidate()
      client?.invalidateQuery(
        Queries.subscription.byView(Number.parseInt(variables.view)).key,
      )

      const feedId = feed.data?.feed.id
      if (feedId) {
        Queries.feed.byId({ id: feedId }).invalidate()
        client?.invalidateQuery(Queries.feed.byId({ id: feedId }).key)
      }
      toast(isSubscribed ? "🎉 Updated." : "🎉 Followed.", {
        duration: 1000,
      })

      if (!isSubscribed) {
        window.close()
      }
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    followMutation.mutate(values)
  }

  const categories = useBizQuery(
    Queries.subscription.categories(Number.parseInt(form.watch("view"))),
  )

  return (
    <div className="flex h-full flex-col px-[18px] pb-[18px] pt-12">
      <div className="mb-4 mt-2 flex items-center gap-2 text-[22px] font-bold">
        <Logo className="size-8" />
        {
          isSubscribed ? "Update" : "Add"

        }
        {" "}
        follow
      </div>
      {feed.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingCircle size="large" />
        </div>
      ) : !feed.data?.feed ?
          (
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
              <p>Feed not found.</p>
              <p>{url}</p>
            </div>
          ) :
          (
            <div className="flex flex-1 flex-col gap-y-4">
              <Card>
                <CardHeader>
                  <FollowSummary feed={feed.data?.feed} />
                </CardHeader>
              </Card>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-1 flex-col gap-y-4"
                >
                  <FormField
                    control={form.control}
                    name="view"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>View</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <ViewSelectContent />
                        </Select>
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
                              suggestions={categories.data?.map((i) => ({
                                name: i,
                                value: i,
                              })) || []}
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
                              Whether this follow is publicly visible on your
                              profile page.
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

                  <div className="flex flex-1 items-end justify-end">
                    <StyledButton
                      type="submit"
                      isLoading={followMutation.isPending}
                    >
                      {isSubscribed ? "Update" : "Follow"}
                    </StyledButton>
                  </div>
                </form>
              </Form>
            </div>
          )}
    </div>
  )
}
