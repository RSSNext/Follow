import { zodResolver } from "@hookform/resolvers/zod"
import { getSidebarActiveView } from "@renderer/atoms/sidebar"
import { StyledButton } from "@renderer/components/ui/button"
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
import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { apiClient } from "@renderer/lib/api-fetch"
import { DEEPLINK_SCHEME } from "@shared/constants"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FollowSummary } from "../../components/feed-summary"
import { FeedForm } from "./feed-form"

const formSchema = z.object({
  keyword: z.string().min(1),
})

const info: Record<
  string,
  {
    label: string
    prefix?: string
  }
> = {
  search: {
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
    prefix: DEEPLINK_SCHEME,
  },
}

export function DiscoverForm({ type }: { type: string }) {
  const { prefix } = info[type]
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: prefix || "",
    },
  })
  const mutation = useMutation({
    mutationFn: async (keyword: string) => {
      const { data } = await apiClient.discover.$post({
        json: {
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

  const { present } = useModalStack()

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
                  <Input autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="center flex">
            <StyledButton type="submit" isLoading={mutation.isPending}>
              Search
            </StyledButton>
          </div>
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
                  <FollowSummary
                    className="max-w-[462px]"
                    feed={item.feed}
                    docs={item.docs}
                  />
                </CardHeader>
                {item.docs ? (
                  <CardFooter>
                    <a href={item.docs} target="_blank" rel="noreferrer">
                      <StyledButton>View Docs</StyledButton>
                    </a>
                  </CardFooter>
                ) : (
                  <>
                    <CardContent>
                      {!!item.entries?.length && (
                        <div className="grid grid-cols-4 gap-4">
                          {item.entries
                            .filter((e) => !!e)
                            .map((entry) => {
                              const assertEntry = entry
                              return (
                                <a
                                  key={assertEntry.id}
                                  href={assertEntry.url || void 0}
                                  target="_blank"
                                  className="flex min-w-0 flex-1 flex-col items-center gap-1"
                                  rel="noreferrer"
                                >
                                  {assertEntry.images?.[0] ? (
                                    <Image
                                      src={assertEntry.images?.[0]}
                                      className="aspect-square w-full"
                                    />
                                  ) : (
                                    <div className="flex aspect-square w-full overflow-hidden rounded bg-stone-100 p-2 text-xs leading-tight text-zinc-500">
                                      {assertEntry.title}
                                    </div>
                                  )}
                                  <div className="line-clamp-2 w-full text-xs leading-tight">
                                    {assertEntry.title}
                                  </div>
                                </a>
                              )
                            })}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {item.isSubscribed ? (
                        <StyledButton variant="plain" disabled>
                          Followed
                        </StyledButton>
                      ) : (
                        <StyledButton
                          onClick={() => {
                            present({
                              title: "Add follow",
                              content: ({ dismiss }) => (
                                <FeedForm
                                  asWidget
                                  url={item.feed.url}
                                  id={item.feed.id}
                                  defaultView={getSidebarActiveView()}
                                  onSuccess={dismiss}
                                />
                              ),
                            })
                          }}
                        >
                          Follow
                        </StyledButton>
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
