import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
import { Switch } from "@renderer/components/ui/switch"
import { FollowSummary } from "../feed-summary"
import { apiFetch } from "@renderer/lib/queries/api-fetch"
import { SubscriptionResponse } from "@renderer/lib/types"

const formSchema = z.object({
  view: z.string(),
  category: z.string().optional(),
  isPrivate: z.boolean().optional(),
})

export function FollowDialog({
  feed,
  onSuccess,
  isSubscribed,
}:
  | {
      feed:
        | SubscriptionResponse[number]
        | {
            feeds: SubscriptionResponse[number]["feeds"]
          }
      onSuccess?: (values: z.infer<typeof formSchema>) => void
      isSubscribed?: false
    }
  | {
      feed: SubscriptionResponse[number]
      onSuccess?: (values: z.infer<typeof formSchema>) => void
      isSubscribed: true
    }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      view: isSubscribed ? feed.view + "" : "0",
      category: isSubscribed ? feed.category : undefined,
      isPrivate: isSubscribed ? feed.isPrivate : false,
    },
  })

  const queryClient = useQueryClient()
  const followMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      apiFetch("/subscriptions", {
        method: isSubscribed ? "PATCH" : "POST",
        body: {
          url: feed.feeds.url,
          view: parseInt(values.view),
          category: values.category,
          isPrivate: values.isPrivate,
          ...(isSubscribed && { feedId: feed.feeds.id }),
        },
      }),
    onSuccess: (_, variables) => {
      if (isSubscribed && variables.view !== feed.view + "") {
        queryClient.invalidateQueries({
          queryKey: ["subscriptions", feed.view],
        })
      }
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", parseInt(variables.view)],
      })
      onSuccess?.(variables)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    followMutation.mutate(values)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Follow</DialogTitle>
      </DialogHeader>
      <FollowSummary feed={feed.feeds} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="view"
            render={({ field }) => (
              <FormItem>
                <FormLabel>View</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {views.map((view, index) => (
                      <SelectItem key={view.name} value={index + ""}>
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
                <div>
                  <FormLabel>Prviate Follow</FormLabel>
                  <FormDescription>
                    Whether to publicly display your follow on your profile
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
          <Button type="submit" isLoading={followMutation.isPending}>
            {isSubscribed ? "Update" : "Follow"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
