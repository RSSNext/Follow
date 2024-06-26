import { zodResolver } from "@hookform/resolvers/zod"
import { StyledButton } from "@renderer/components/ui/button"
import { Form, FormItem, FormLabel } from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { Markdown } from "@renderer/components/ui/markdown"
import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { FeedViewType } from "@renderer/lib/enum"
import {
  parseRegexpPathParams,
  regexpPathToPath,
} from "@renderer/lib/path-parser"
import type { FC } from "react"
import { useCallback, useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FeedForm } from "./feed-form"
import type { RSSHubRoute } from "./types"

const formSchema = z.object({})
export const RecommendationContent = ({
  route,
  routePrefix,
}: {
  route: RSSHubRoute
  routePrefix: string
}) => (
  <div className="max-w-[700px]">
    <p>
      The description of this feed is as follows, and you can fill out the
      parameter form with the relevant information.
    </p>
    <Markdown className="my-4 w-full max-w-full cursor-text select-text">
      {route.description}
    </Markdown>
    <DiscoverFeedForm route={route} routePrefix={routePrefix} />
  </div>
)

const DiscoverFeedForm = ({
  route,
  routePrefix,
}: {
  route: RSSHubRoute
  routePrefix
}) => {
  const keys = parseRegexpPathParams(route.path)

  const dynamicFormSchema = useMemo(
    () =>
      z.object({
        ...Object.fromEntries(
          keys.array.map((keyItem) => [
            keyItem.name,
            keyItem.optional ? z.string().optional() : z.string().min(1),
          ]),
        ),
      }),
    [keys],
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {},
  }) as UseFormReturn<any>

  const { present } = useModalStack()
  const onSubmit = useCallback((data) => {
    present({
      title: "Add follow",
      content: ({ dismiss }) => {
        const url = `rsshub://${routePrefix}${regexpPathToPath(route.path, data)}`
        return (
          <FeedForm
            asWidget
            url={url}
            defaultView={FeedViewType.Articles}
            onSuccess={dismiss}
          />
        )
      },
    })
  }, [present, route.path, routePrefix])

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {keys.array.map((keyItem) => (
          <FormItem key={keyItem.name} className="flex flex-col space-y-2">
            <FormLabel>
              {keyItem.name}
              {!keyItem.optional && (
                <sup className="ml-1 align-sub text-red-500">*</sup>
              )}
            </FormLabel>
            <Input {...form.register(keyItem.name)} />
            <p className="text-xs text-theme-foreground/50">
              {route.parameters[keyItem.name]}
            </p>
          </FormItem>
        ))}

        <PreviewUrl
          watch={form.watch}
          path={`rsshub://${routePrefix}${route.path}`}
        />
        <div className="mt-4 flex justify-end">
          <StyledButton type="submit">Preview</StyledButton>
        </div>
      </form>
    </Form>
  )
}

const PreviewUrl: FC<{
  watch: UseFormReturn<any>["watch"]
  path: string
}> = ({ watch, path }) => {
  const data = watch()

  const fullPath = useMemo(() => {
    try {
      const url = new URL(path)
      const { protocol, pathname } = url

      return `${protocol}/${regexpPathToPath(pathname, data)}`
    } catch {
      return path
    }
  }, [path, data])

  return <pre className="text-xs text-theme-foreground/30">{fullPath}</pre>
}
