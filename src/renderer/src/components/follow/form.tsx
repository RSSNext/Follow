import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@renderer/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@renderer/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Image } from "@renderer/components/ui/image"
import { Input } from "@renderer/components/ui/input"
import type { EntriesResponse, FeedResponse } from "@renderer/lib/types"
import { apiFetch } from "@renderer/queries/api-fetch"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FollowSummary } from "../feed-summary"
import { FollowButton } from "./button"

const formSchema = z.object({
  keyword: z.string().min(1),
})

const info: Record<string, {
  label: string
  prefix?: string
}> = {
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
  const { prefix } = info[type]
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: prefix || "",
    },
  })
  const mutation = useMutation({
    mutationFn: async (keyword: string) => {
      const { data } = await apiFetch<{
        data: {
          feed: FeedResponse
          docs?: string
          entries?: Partial<EntriesResponse>
          isSubscribed?: boolean
          subscriptionCount?: number
        }[]
      }>("/discover", {
        method: "POST",
        body: {
          keyword,
          type: type === "rss" ? "rss" : "auto",
        },
      })
      return data
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
          className="w-[512px] space-y-8"
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
        <div className="mt-8 max-w-lg">
          <div className="mb-4 text-zinc-500">
            Found
            {" "}
            {mutation.data?.length || 0}
            {" "}
            feed
            {mutation.data?.length > 1 && "s"}
          </div>
          <div className="space-y-6 text-sm">
            {mutation.data?.map((item) => (
              <Card key={item.feed.url || item.docs} className="select-text">
                <CardHeader>
                  <FollowSummary feed={item.feed} docs={item.docs} />
                </CardHeader>
                {item.docs ?
                    (
                      <CardFooter>
                        <a href={item.docs} target="_blank" rel="noreferrer">
                          <Button>View Docs</Button>
                        </a>
                      </CardFooter>
                    ) :
                    (
                      <>
                        <CardContent>
                          {!!item.entries?.length && (
                            <div className="grid grid-cols-4 gap-4">
                              {item.entries
                                .filter((e) => !!e)
                                .map((entry) => (
                                  <a
                                    key={entry.id}
                                    href={entry.url}
                                    target="_blank"
                                    className="flex min-w-0 flex-1 flex-col items-center gap-1"
                                    rel="noreferrer"
                                  >
                                    {entry.images?.[0] ?
                                        (
                                          <Image
                                            src={entry.images?.[0]}
                                            className="aspect-square w-full"
                                          />
                                        ) :
                                        (
                                          <div className="flex aspect-square w-full overflow-hidden rounded bg-stone-100 p-2 text-xs leading-tight text-zinc-500">
                                            {entry.title}
                                          </div>
                                        )}
                                    <div className="line-clamp-2 w-full text-xs leading-tight">
                                      {entry.title}
                                    </div>
                                  </a>
                                ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          {item.isSubscribed ?
                              (
                                <Button variant="outline" disabled>
                                  Followed
                                </Button>
                              ) :
                              (
                                <FollowButton feed={item.feed} />
                              )}
                          <div className="ml-6 text-zinc-500">
                            <span className="font-medium text-zinc-800">
                              {item.subscriptionCount}
                            </span>
                            {" "}
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
