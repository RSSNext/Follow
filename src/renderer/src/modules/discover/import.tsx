import { zodResolver } from "@hookform/resolvers/zod"
import { StyledButton } from "@renderer/components/ui/button"
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { apiFetch } from "@renderer/lib/api-fetch"
import { cn } from "@renderer/lib/utils"
import type { FeedResponse } from "@renderer/models"
import { Queries } from "@renderer/queries"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FollowSummary } from "../../components/feed-summary"

type FeedResponseList = {
  id: string
  url: string
  title: string | null
}[]

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size < 500_000, {
    message: "Your OPML file must be less than 500KB.",
  }),
})

const list = [
  {
    key: "parsedErrorItems",
    title: "Parsed Error Items",
    className: "text-red-500",
  },
  {
    key: "successfulItems",
    title: "Successful Items",
    className: "text-green-500",
  },
  {
    key: "conflictItems",
    title: "Conflict Items",
    className: "text-yellow-500",
  },
]

export function DiscoverImport() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      // FIXME: if post data is form data, hono hc not support this.

      const { data } = await apiFetch<{
        data: {
          successfulItems: FeedResponseList
          conflictItems: FeedResponseList
          parsedErrorItems: FeedResponseList
        }
      }>("/import", {
        method: "POST",
        body: formData,
      })

      return data
    },
    onSuccess: () => {
      Queries.subscription.byView().invalidateRoot()
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values.file)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[512px] space-y-8"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>OPML file</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder="Picture"
                    type="file"
                    accept=".opml"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <StyledButton type="submit" isLoading={mutation.isPending}>
            Import
          </StyledButton>
        </form>
      </Form>
      {mutation.isSuccess && (
        <div className="mt-8 max-w-lg">
          <Card>
            <CardHeader className="block text-zinc-500">
              <span className="font-bold text-zinc-800">
                {mutation.data?.successfulItems.length || 0}
              </span>
              {" "}
              feeds were successfully imported,
              {" "}
              <span className="font-bold text-zinc-800">
                {mutation.data?.conflictItems.length || 0}
              </span>
              {" "}
              were already subscribed to, and
              {" "}
              <span className="font-bold text-zinc-800">
                {mutation.data?.parsedErrorItems.length || 0}
              </span>
              {" "}
              failed to import.
            </CardHeader>
            <CardContent className="space-y-6">
              {list.map((item) => (
                <div key={item.key}>
                  <div
                    className={cn("mb-4 text-lg font-medium", item.className)}
                  >
                    {item.title}
                  </div>
                  <div className="space-y-4">
                    {!mutation.data?.[item.key].length && (
                      <div className="text-zinc-500">No items</div>
                    )}
                    {mutation.data?.[item.key].map((feed: FeedResponse) => (
                      <FollowSummary className="max-w-[462px]" key={feed.id} feed={feed} />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
