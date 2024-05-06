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

export function SubscribeForm({ type }: { type: string }) {
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
              }),
            },
          )
        ).json()
      ).data as {
        title?: string
        description?: string
        siteUrl?: string
        image?: string
        url?: string
        docs?: string
      }[]
    },
  })
  console.log(mutation.data)

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit">Search</Button>
        </form>
      </Form>
      {mutation.data && (
        <div className="max-w-lg mt-8">
          <div className="text-zinc-500 text-sm mb-2">
            Found {mutation.data.length} results
          </div>
          <div className="space-y-4 text-sm">
            {mutation.data.map((item) => (
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  {item.siteUrl && (
                    <SiteIcon url={item.siteUrl} className="w-6 h-6" />
                  )}
                  {item.docs && (
                    <SiteIcon url="https://rsshub.app" className="w-6 h-6" />
                  )}
                  <div className="leading-tight">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-zinc-500">{item.url || item.docs}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="line-clamp-2 text-xs text-zinc-500">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
