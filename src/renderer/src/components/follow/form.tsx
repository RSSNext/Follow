import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@renderer/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { getCsrfToken } from "@hono/auth-js/react"
import { SiteIcon } from "@renderer/components/site-icon"
import { Image } from "@renderer/components/ui/image"
import { FeedResponse, EntriesResponse } from "@renderer/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card"

const formSchema = z.object({
  keyword: z.string().min(1),
})

const info: {
  [key: string]: {
    label: string
    prefix?: string
  }
} = {
  general: {
    label: "Any URL or Keyword",
  },
  rss: {
    label: "RSS URL",
  },
  rsshub: {
    label: "RSSHub Route",
    prefix: "rsshub://",
  },
  user: {
    label: "User Handle",
    prefix: "follow://",
  },
}

export function FollowForm({ type }: { type: string }) {
  const prefix = info[type].prefix
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: prefix,
    },
  })
  const mutation = useMutation({
    mutationFn: async (keyword: string) => {
      return (
        await (
          await fetch(
            `${import.meta.env.VITE_ELECTRON_REMOTE_API_URL}/discover`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                csrfToken: await getCsrfToken(),
                keyword,
                type: type === "rss" ? "rss" : "auto",
              }),
            },
          )
        ).json()
      ).data as {
        feed: Partial<FeedResponse>
        docs?: string
        entries?: Partial<EntriesResponse>
        isSubscribed?: boolean
        subscriptionCount?: number
      }[]
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values.keyword)
  }

  const keyword = form.watch("keyword")
  useEffect(() => {
    if (prefix) {
      if (!keyword.startsWith(prefix)) {
        form.setValue("keyword", prefix)
      } else if (keyword.startsWith(`${prefix}${prefix}`)) {
        form.setValue("keyword", keyword.slice(prefix.length))
      }
    }
  }, [keyword])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[512px]"
        >
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{info[type]?.label}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" isLoading={mutation.isPending}>
            Search
          </Button>
        </form>
      </Form>
      {mutation.isSuccess && (
        <div className="max-w-lg mt-8">
          <div className="text-zinc-500 mb-4">
            Found {mutation.data?.length || 0} feed
            {mutation.data?.length > 1 && "s"}
          </div>
          <div className="space-y-6 text-sm">
            {mutation.data?.map((item) => (
              <Card key={item.feed.url || item.docs} className="select-text">
                <CardHeader>
                  <CardTitle>
                    <a
                      href={item.feed.siteUrl}
                      target="_blank"
                      className="flex items-center"
                    >
                      {(() => {
                        if (item.feed.image) {
                          return (
                            <Image
                              src={item.feed.image}
                              className="w-6 h-6 mr-2"
                            />
                          )
                        } else if (item.feed.siteUrl) {
                          return (
                            <SiteIcon
                              url={item.feed.siteUrl}
                              className="w-6 h-6"
                            />
                          )
                        } else if (item.docs) {
                          return (
                            <SiteIcon
                              url="https://rsshub.app"
                              className="w-6 h-6"
                            />
                          )
                        } else {
                          return null
                        }
                      })()}
                      <div className="leading-tight font-medium text-base">
                        {item.feed.title}
                      </div>
                    </a>
                  </CardTitle>
                  <CardDescription>
                    <div className="text-zinc-500">
                      {item.feed.url || item.docs}
                    </div>
                    <div className="flex items-center">
                      <div className="line-clamp-2 text-xs">
                        {item.feed.description}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                {item.docs ? (
                  <CardFooter>
                    <Button>View Docs</Button>
                  </CardFooter>
                ) : (
                  <>
                    <CardContent>
                      {item.entries?.length && (
                        <div className="grid grid-cols-4 gap-4">
                          {item.entries.map((entry) => (
                            <a
                              href={entry?.url}
                              target="_blank"
                              className="flex items-center gap-1 flex-col min-w-0 flex-1"
                            >
                              {entry?.images?.[0] ? (
                                <Image
                                  src={entry?.images?.[0]}
                                  className="aspect-square w-full"
                                />
                              ) : (
                                <div className="bg-stone-100 rounded text-zinc-500 p-2 overflow-hidden w-full aspect-square text-xs leading-tight flex">
                                  {entry?.title}
                                </div>
                              )}
                              <div className="line-clamp-2 w-full text-xs leading-tight">
                                {entry?.title}
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {item.isSubscribed ? (
                        <Button variant="outline" disabled>
                          Followed
                        </Button>
                      ) : (
                        <Button>Follow</Button>
                      )}
                      <div className="ml-6 text-zinc-500">
                        <span className="text-zinc-800 font-medium">
                          {item.subscriptionCount}
                        </span>{" "}
                        Followers
                      </div>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
