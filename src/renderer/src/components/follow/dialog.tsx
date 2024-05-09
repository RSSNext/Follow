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
import { useMutation } from "@tanstack/react-query"
import { getCsrfToken } from "@hono/auth-js/react"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { FeedResponse } from "@renderer/lib/types"
import { SiteIcon } from "@renderer/components/site-icon"
import { Image } from "@renderer/components/ui/image"
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

const formSchema = z.object({
  view: z.enum(["0", "1", "2", "3", "4", "5"]),
  category: z.string().optional(),
  private: z.boolean(),
})

export function FollowDialog({ feed }: { feed: Partial<FeedResponse> }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      view: "0",
    },
  })
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // return (
      //   await (
      //     await fetch(
      //       `${import.meta.env.VITE_ELECTRON_REMOTE_API_URL}/discover`,
      //       {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //         credentials: "include",
      //         body: JSON.stringify({
      //           csrfToken: await getCsrfToken(),
      //         }),
      //       },
      //     )
      //   ).json()
      // ).data
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Follow</DialogTitle>
      </DialogHeader>
      <div className="text-sm">
        <div className="flex items-center mb-1">
          {(() => {
            if (feed.image) {
              return <Image src={feed.image} className="w-8 h-8 mr-2" />
            } else if (feed.siteUrl) {
              return <SiteIcon url={feed.siteUrl} className="w-8 h-8" />
            } else {
              return null
            }
          })()}
          <div className="leading-tight font-semibold text-base">
            {feed.title}
            <div className="font-normal truncate text-xs text-zinc-500">
              {feed.description}
            </div>
          </div>
        </div>
        <div className="text-zinc-500 flex items-center gap-1">
          <i className="i-mingcute-right-line" />
          {feed.url}
        </div>
      </div>
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
                    By default, follows will be grouped by website.
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
            name="private"
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
          <Button type="submit" isLoading={mutation.isPending}>
            Follow
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
