import { zodResolver } from "@hookform/resolvers/zod"
import { StyledButton } from "@renderer/components/ui/button"
import { CopyButton } from "@renderer/components/ui/code-highlighter"
import { Form, FormItem, FormLabel } from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { Markdown } from "@renderer/components/ui/markdown"
import { useModalStack } from "@renderer/components/ui/modal"
import { FeedViewType } from "@renderer/lib/enum"
import {
  MissingOptionalParamError,
  parseFullPathParams,
  parseRegexpPathParams,
  regexpPathToPath,
} from "@renderer/lib/path-parser"
import type { FC } from "react"
import { useCallback, useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { FeedForm } from "./feed-form"
import type { RSSHubRoute } from "./types"

const FeedMaintainers = ({
  maintainers,
}: {
  maintainers?: string[]
}) => {
  if (!maintainers || maintainers.length === 0) {
    return null
  }

  return (
    <div className="mb-2 text-sm">
      <p>
        The maintainers of this feed are as follows. If you have any questions
        or suggestions, you can contact them.
      </p>
      <ul className="flex flex-wrap items-center gap-4">
        {maintainers.map((maintainer) => (
          <a
            href={`https://github.com/${maintainer}`}
            key={maintainer}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex cursor-pointer items-center text-theme-foreground/50 duration-200 hover:text-theme-accent"
          >
            @
            {maintainer}
            <i className="i-mgc-external-link-cute-re ml-0.5" />
          </a>
        ))}
      </ul>
    </div>
  )
}

export const FeedDescription = ({ description }: { description?: string }) => {
  if (!description) {
    return <p className="mb-4">This feed does not have a description.</p>
  }

  return (
    <>
      <p>
        The description of this feed is as follows, and you can fill out the
        parameter form with the relevant information.
      </p>
      <Markdown className="my-4 w-full max-w-full cursor-text select-text">
        {description}
      </Markdown>
    </>
  )
}

export const DiscoverFeedForm = ({
  route,
  routePrefix,
}: {
  route: RSSHubRoute
  routePrefix
}) => {
  const keys = parseRegexpPathParams(route.path)

  const formPlaceholder = useMemo<Record<string, string>>(() => {
    if (!route.example) return {}
    return parseFullPathParams(
      route.example.replace(`/${routePrefix}`, ""),
      route.path,
    )
  }, [route.example, route.path, routePrefix])
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
  const form = useForm<z.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {},
    mode: "all",
  }) as UseFormReturn<any>

  const { present } = useModalStack()
  const onSubmit = useCallback(
    (data) => {
      try {
        //   Delete empty string values
        const nextData = { ...data }
        for (const key in nextData) {
          if (nextData[key] === "") {
            delete nextData[key]
          }
        }

        const fillRegexpPath = regexpPathToPath(route.path, nextData)
        const url = `rsshub://${routePrefix}${fillRegexpPath}`
        present({
          title: "Add follow",
          content: ({ dismiss }) => (
            <FeedForm
              asWidget
              url={url}
              defaultView={FeedViewType.Articles}
              onSuccess={dismiss}
            />
          ),
        })
      } catch (err: unknown) {
        if (err instanceof MissingOptionalParamError) {
          toast.error(err.message)
          const idx = keys.array.findIndex((item) => item.name === err.param)

          form.setFocus(keys.array[idx === 0 ? 0 : idx - 1].name)
        }
      }
    },
    [form, keys.array, present, route.path, routePrefix],
  )

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
            <Input
              {...form.register(keyItem.name)}
              placeholder={formPlaceholder[keyItem.name]}
            />
            {!!route.parameters?.[keyItem.name] && (
              <p className="text-xs text-theme-foreground/50">
                {route.parameters[keyItem.name]}
              </p>
            )}
          </FormItem>
        ))}

        <PreviewUrl
          watch={form.watch}
          path={route.path}
          routePrefix={`rsshub://${routePrefix}`}
        />

        <FeedMaintainers maintainers={route.maintainers} />

        <div className="sticky bottom-0 -mt-4 flex w-full translate-y-3 justify-end bg-theme-modal-background-opaque py-3">
          <StyledButton disabled={!form.formState.isValid} type="submit">
            Preview
          </StyledButton>
        </div>
      </form>
    </Form>
  )
}

const PreviewUrl: FC<{
  watch: UseFormReturn<any>["watch"]
  path: string
  routePrefix: string
}> = ({ watch, path, routePrefix }) => {
  const data = watch()

  const fullPath = useMemo(() => {
    try {
      return regexpPathToPath(path, data)
    } catch (err: unknown) {
      console.info((err as Error).message)
      return path
    }
  }, [path, data])

  const renderedPath = `${routePrefix}${fullPath}`
  return (
    <div className="group relative min-w-0 py-2">
      <pre className="w-full whitespace-pre-line break-words text-xs text-theme-foreground/40">
        {renderedPath}
      </pre>
      <CopyButton value={renderedPath} className="absolute right-0 top-0 opacity-0 duration-200 group-hover:opacity-100" />
    </div>
  )
}
