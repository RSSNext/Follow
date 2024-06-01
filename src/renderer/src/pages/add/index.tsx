import { zodResolver } from "@hookform/resolvers/zod"
import { FollowSummary } from "@renderer/components/feed-summary"
import { AutoComplete } from "@renderer/components/ui/autocomplete"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { Switch } from "@renderer/components/ui/switch"
import { useToast } from "@renderer/components/ui/use-toast"
import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { client } from "@renderer/lib/client"
import { views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
import { Queries } from "@renderer/queries"
import { apiFetch } from "@renderer/queries/api-fetch"
import { useFeed } from "@renderer/queries/feed"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  view: z.string(),
  category: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
})

export function Component() {
  const urlSearchParams = new URLSearchParams(location.search)
  const paramUrl = urlSearchParams.get("url")
  const url = paramUrl ? decodeURIComponent(paramUrl) : undefined
  const id = urlSearchParams.get("id") || undefined

  const feed = useFeed({
    url,
    id,
  })

  const isSubscribed = !!feed.data?.subscription
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      view: "0",
    },
  })

  useEffect(() => {
    if (feed.data?.subscription) {
      form.setValue("view", `${feed.data?.subscription?.view}`)
      form.setValue("category", feed.data?.subscription?.category)
      form.setValue("isPrivate", feed.data?.subscription?.isPrivate || false)
    }
  }, [feed.data?.subscription])

  const { toast } = useToast()
  const followMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      apiFetch("/subscriptions", {
        method: isSubscribed ? "PATCH" : "POST",
        body: {
          url: feed.data?.feed.url,
          view: Number.parseInt(values.view),
          category: values.category,
          isPrivate: values.isPrivate,
          ...(isSubscribed && { feedId: feed.data?.feed.id }),
        },
      }),
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
      Queries.feed.byId({ id: feed.data?.feed.id }).invalidate()
      client?.invalidateQuery(
        Queries.feed.byId({ id: feed.data?.feed.id }).key,
      )
      toast({
        duration: 1000,
        description: isSubscribed ? "🎉 Updated." : "🎉 Followed.",
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    followMutation.mutate(values)
  }

  const categories = useBizQuery(
    Queries.subscription.categories(Number.parseInt(form.watch("view"))),
  )

  return (
    <div className="flex h-full flex-col p-10">
      <div className="mb-4 mt-2 flex items-center gap-2 text-[22px] font-bold">
        <img src="../icon.svg" alt="logo" className="size-8" />
        Add follow
      </div>
      {feed.isLoading ?
          (
            <div className="flex flex-1 items-center justify-center">
              Loading...
            </div>
          ) :
          !feed.data?.feed ?
              (
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                  <p>Feed not found.</p>
                  <p>{url}</p>
                </div>
              ) :
              (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <FollowSummary feed={feed.data?.feed} />
                    </CardHeader>
                  </Card>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                              <SelectContent>
                                {views.map((view, index) => (
                                  <SelectItem key={view.name} value={`${index}`}>
                                    <div className="flex items-center gap-2">
                                      <span className={cn(view.className, "flex")}>
                                        {view.icon}
                                      </span>
                                      <span>{view.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
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
                              <AutoComplete
                                options={categories.data || []}
                                emptyMessage="No results."
                                {...field}
                              />
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
                            <div>
                              <FormLabel>Prviate Follow</FormLabel>
                              <FormDescription>
                                Whether this follow is publicly visible on your profile
                                page.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        size="sm"
                        type="submit"
                        isLoading={followMutation.isPending}
                      >
                        {isSubscribed ? "Update" : "Follow"}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
    </div>
  )
}
