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
import { Image } from "@renderer/components/ui/image"
import { FeedResponse, EntriesResponse } from "@renderer/lib/types"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@renderer/components/ui/card"
import { FollowButton } from "./button"
import { FollowSummary } from "../feed-summary"
import { apiFetch } from "@renderer/lib/queries/api-fetch"

type FeedResponseList = {
  id: string
  url: string
  title: string | null
}[]

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size < 500000, {
    message: "Your OPML file must be less than 500KB.",
  }),
})

export function FollowImport() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
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
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values.file)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[512px]"
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
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" isLoading={mutation.isPending}>
            Import
          </Button>
        </form>
      </Form>
      {mutation.isSuccess && (
        <div className="max-w-lg mt-8">
          <div className="text-zinc-500 mb-4">
            {mutation.data?.successfulItems.length || 0} feeds were successfully
            imported, {mutation.data?.conflictItems.length || 0} were already
            subscribed to, and {mutation.data?.parsedErrorItems.length || 0}{" "}
            failed to import.
          </div>
          <div className="space-y-6 text-sm">
            {/* {mutation.data?.map((item) => (
              <Card key={item.feed.url || item.docs} className="select-text">
                <CardHeader>
                  <FollowSummary feed={item.feed} docs={item.docs} />
                </CardHeader>
                {item.docs ? (
                  <CardFooter>
                    <a href={item.docs} target="_blank">
                      <Button>View Docs</Button>
                    </a>
                  </CardFooter>
                ) : (
                  <>
                    <CardContent>
                      {!!item.entries?.length && (
                        <div className="grid grid-cols-4 gap-4">
                          {item.entries
                            .filter((e) => !!e)
                            .map((entry) => (
                              <a
                                key={entry!.id}
                                href={entry!.url}
                                target="_blank"
                                className="flex items-center gap-1 flex-col min-w-0 flex-1"
                              >
                                {entry!.images?.[0] ? (
                                  <Image
                                    src={entry!.images?.[0]}
                                    className="aspect-square w-full"
                                  />
                                ) : (
                                  <div className="bg-stone-100 rounded text-zinc-500 p-2 overflow-hidden w-full aspect-square text-xs leading-tight flex">
                                    {entry!.title}
                                  </div>
                                )}
                                <div className="line-clamp-2 w-full text-xs leading-tight">
                                  {entry!.title}
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
                        <FollowButton feed={item.feed} />
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
            ))} */}
          </div>
        </div>
      )}
    </>
  )
}
