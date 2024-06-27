import { zodResolver } from "@hookform/resolvers/zod"
import { getSidebarActiveView } from "@renderer/atoms/sidebar"
import { StyledButton } from "@renderer/components/ui/button"
import { CopyButton } from "@renderer/components/ui/code-highlighter"
import { Form, FormItem, FormLabel } from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { Markdown } from "@renderer/components/ui/markdown"
import { useModalStack } from "@renderer/components/ui/modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import type { FeedViewType } from "@renderer/lib/enum"
import {
  MissingOptionalParamError,
  parseFullPathParams,
  parseRegexpPathParams,
  regexpPathToPath,
} from "@renderer/lib/path-parser"
import { omit } from "lodash-es"
import type { FC } from "react"
import { useCallback, useLayoutEffect, useMemo, useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { FeedForm } from "./feed-form"
import type { RSSHubRoute } from "./types"
import { normalizeRSSHubParameters } from "./utils"

const FeedMaintainers = ({ maintainers }: { maintainers?: string[] }) => {
  if (!maintainers || maintainers.length === 0) {
    return null
  }

  return (
    <div className="mb-2 flex flex-col gap-x-1 text-sm text-theme-foreground/80">
      <span>This feed is provided by RSSHub, with credit to</span>
      <span className="inline-flex flex-wrap items-center gap-2">
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
      </span>
    </div>
  )
}

const FeedDescription = ({ description }: { description?: string }) => {
  if (!description) {
    return null
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
  routePrefix: string
}) => {
  const keys = useMemo(
    () =>
      parseRegexpPathParams(route.path, {
        excludeNames: ["routeParams"],
      }),
    [route.path],
  )

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

  const defaultValue = useMemo(() => {
    const ret = {}
    if (!route.parameters) return ret
    for (const key in route.parameters) {
      const params = normalizeRSSHubParameters(route.parameters[key])
      if (!params) continue
      ret[key] = params.default
    }
    return ret
  }, [route.parameters])
  const form = useForm<z.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: defaultValue,
    mode: "all",
  }) as UseFormReturn<any>

  const { present, dismissAll } = useModalStack()

  const onSubmit = useCallback(
    (data: Record<string, string>) => {
      try {
        const fillRegexpPath = regexpPathToPath(route.path, data)
        const url = `rsshub://${routePrefix}${fillRegexpPath}`
        const defaultView = getSidebarActiveView() as FeedViewType

        present({
          title: "Add follow",
          content: () => (
            <FeedForm
              asWidget
              url={url}
              defaultView={defaultView}
              onSuccess={dismissAll}
            />
          ),
        })
      } catch (err: unknown) {
        if (err instanceof MissingOptionalParamError) {
          toast.error(err.message)
          const idx = keys.array.findIndex((item) => item.name === err.param)

          form.setFocus(keys.array[idx === 0 ? 0 : idx - 1].name, {
            shouldSelect: true,
          })
        }
      }
    },
    [dismissAll, form, keys.array, present, route.path, routePrefix],
  )

  const formElRef = useRef<HTMLFormElement>(null)

  useLayoutEffect(() => {
    const $form = formElRef.current
    if (!$form) return
    $form.querySelectorAll("input")[0]?.focus()
  }, [formElRef])
  return (
    <Form {...form}>
      <PreviewUrl
        watch={form.watch}
        path={route.path}
        routePrefix={`rsshub://${routePrefix}`}
      />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        ref={formElRef}
      >
        {keys.array.map((keyItem) => {
          const parameters = normalizeRSSHubParameters(
            route.parameters[keyItem.name],
          )

          const formRegister = form.register(keyItem.name)

          return (
            <FormItem key={keyItem.name} className="flex flex-col space-y-2">
              <FormLabel>
                {keyItem.name}
                {!keyItem.optional && (
                  <sup className="ml-1 align-sub text-red-500">*</sup>
                )}
              </FormLabel>
              {parameters?.options ? (
                <Select
                  {...omit(formRegister, "ref")}
                  onValueChange={(value) => {
                    form.setValue(keyItem.name, value)
                  }}
                  defaultValue={parameters.default || void 0}
                >
                  {/* Select focused ref on `SelectTrigger` or `Select` */}
                  <SelectTrigger ref={formRegister.ref}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {parameters.options.map((option) => (
                      <SelectItem key={option.value} value={option.value || ""}>
                        {option.label}
                        {parameters.default === option.value && " (default)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  {...formRegister}
                  placeholder={parameters?.default ?? formPlaceholder[keyItem.name] ? `e.g. ${formPlaceholder[keyItem.name]}` : void 0}
                />
              )}
              {!!parameters && (
                <p className="text-xs text-theme-foreground/50">
                  {parameters.description}
                </p>
              )}
            </FormItem>
          )
        })}

        <FeedDescription description={route.description} />

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
    <div className="group relative min-w-0 pb-4">
      <pre className="w-full whitespace-pre-line break-words text-xs text-theme-foreground/40">
        {renderedPath}
      </pre>
      <CopyButton
        value={renderedPath}
        className="absolute right-0 top-0 opacity-0 duration-200 group-hover:opacity-100"
      />
    </div>
  )
}
