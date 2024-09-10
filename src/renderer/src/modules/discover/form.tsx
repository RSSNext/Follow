import { zodResolver } from "@hookform/resolvers/zod"
import { getSidebarActiveView } from "@renderer/atoms/sidebar"
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
import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { apiClient } from "@renderer/lib/api-fetch"
import type { FeedViewType } from "@renderer/lib/enum"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FeedCard } from "./feed-card"
import { FeedForm } from "./feed-form"

const formSchema = z.object({
  keyword: z.string().min(1),
})

const info: Record<
  string,
  {
    label: string
    prefix?: string[]
    showModal?: boolean
    default?: string
  }
> = {
  search: {
    label: "Any URL or Keyword",
  },
  rss: {
    label: "RSS URL",
    default: "https://",
    prefix: ["https://", "http://"],
    showModal: true,
  },
  rsshub: {
    label: "RSSHub Route",
    prefix: ["rsshub://"],
    default: "rsshub://",
    showModal: true,
  },
}

export function DiscoverForm({ type }: { type: string }) {
  const { prefix, default: defaultValue } = info[type]
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: defaultValue || "",
    },
  })

  const { present, dismissAll } = useModalStack()

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (info[type].showModal) {
      const defaultView = getSidebarActiveView() as FeedViewType
      present({
        title: "Add Feed",
        content: () => (
          <FeedForm
            asWidget
            url={values.keyword}
            defaultValues={{
              view: defaultView.toString(),
            }}
            onSuccess={dismissAll}
          />
        ),
      })
    } else {
      query.refetch()
    }
  }

  const keyword = form.watch("keyword")
  useEffect(() => {
    if (!prefix) return
    const isValidPrefix = prefix.find((p) => keyword.startsWith(p))
    if (!isValidPrefix) {
      form.setValue("keyword", prefix[0])

      return
    }

    if (keyword.startsWith(`${isValidPrefix}${isValidPrefix}`)) {
      form.setValue("keyword", keyword.slice(isValidPrefix.length))
    }
  }, [form, keyword, prefix])

  const query = useQuery({
    queryKey: ["discover", keyword],
    queryFn: async () => {
      const { data } = await apiClient.discover.$post({
        json: {
          keyword,
        },
      })

      return data
    },
    enabled: false,
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[512px] space-y-8">
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
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              isLoading={query.isLoading}
            >
              {info[type].showModal ? "Preview" : "Search"}
            </Button>
          </div>
        </form>
      </Form>
      {query.isSuccess && (
        <div className="mt-8 max-w-lg">
          <div className="mb-4 text-zinc-500">
            Found
            {" "}
            {query.data?.length || 0}
            {" "}
            feed
            {query.data?.length > 1 && "s"}
          </div>
          <div className="space-y-6 text-sm">
            {query.data?.map((item) => (
              <FeedCard key={item.feed.id} data={item} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
