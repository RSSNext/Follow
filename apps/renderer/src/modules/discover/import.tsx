import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Fragment } from "react/jsx-runtime"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { apiFetch } from "~/lib/api-fetch"
import { toastFetchError } from "~/lib/error-parser"
import { cn } from "~/lib/utils"
import type { FeedResponse } from "~/models"
import { Queries } from "~/queries"

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
      }>("/subscriptions/import", {
        method: "POST",
        body: formData,
      })

      return data
    },
    onSuccess: () => {
      Queries.subscription.byView().invalidateRoot()
    },
    async onError(err) {
      toastFetchError(err)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values.file)
  }
  const { t } = useTranslation()

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[512px] space-y-8">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>OPML file</FormLabel>
                <FormControl>
                  <label
                    className="center flex h-[100px] w-full rounded-md border border-dashed"
                    htmlFor="upload-file"
                  >
                    {form.formState.dirtyFields.file ? (
                      <Fragment>
                        <i className="i-mgc-file-upload-cute-re size-5" />

                        <span className="ml-2 text-sm font-semibold opacity-80">{value.name}</span>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <i className="i-mgc-file-upload-cute-re size-5" />

                        <span className="ml-2 text-sm opacity-80">
                          {t("discover.import.click_to_upload")}
                        </span>
                      </Fragment>
                    )}
                  </label>
                </FormControl>
                <Input
                  {...fieldProps}
                  id="upload-file"
                  type="file"
                  accept=".opml,.xml"
                  className="hidden"
                  onChange={(event) => onChange(event.target.files && event.target.files[0])}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="center flex">
            <Button
              type="submit"
              disabled={!form.formState.dirtyFields.file}
              isLoading={mutation.isPending}
            >
              {t("words.import")}
            </Button>
          </div>
        </form>
      </Form>
      {mutation.isSuccess && (
        <div className="mt-8 max-w-lg">
          <Card>
            <CardHeader className="block text-zinc-500">
              <span className="font-bold text-zinc-800">
                {mutation.data?.successfulItems.length || 0}
              </span>{" "}
              feeds were successfully imported,{" "}
              <span className="font-bold text-zinc-800">
                {mutation.data?.conflictItems.length || 0}
              </span>{" "}
              were already subscribed to, and{" "}
              <span className="font-bold text-zinc-800">
                {mutation.data?.parsedErrorItems.length || 0}
              </span>{" "}
              failed to import.
            </CardHeader>
            <CardContent className="space-y-6">
              {list.map((item) => (
                <div key={item.key}>
                  <div className={cn("mb-4 text-lg font-medium", item.className)}>{item.title}</div>
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
