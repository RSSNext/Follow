import { zodResolver } from "@hookform/resolvers/zod"
import { StyledButton } from "@renderer/components/ui/button"
import { Form, FormItem, FormLabel } from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { Markdown } from "@renderer/components/ui/markdown"
import { parseRegexpPathParams } from "@renderer/lib/path-parser"
import type { FC } from "react"
import { useCallback, useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { RSSHubRoute } from "./types"

const formSchema = z.object({})
export const RecommendationContent = ({ route }: { route: RSSHubRoute }) => {
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

  const onSubmit = useCallback(() => {}, [])

  return (
    <div className="max-w-[700px]">
      <p>
        The description of this feed is as follows, and you can fill out the
        parameter form with the relevant information.
      </p>
      <Markdown className="my-4 w-full max-w-full cursor-text select-text">
        {route.description}
      </Markdown>
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {keys.array.map((keyItem) => (
            <FormItem key={keyItem.name}>
              <FormLabel>
                {keyItem.name}
                {!keyItem.optional && (
                  <sup className="ml-1 align-sub text-red-500">
                    *
                  </sup>
                )}

              </FormLabel>
              <Input {...form.register(keyItem.name)} />
            </FormItem>
          ))}

          <PreviewUrl watch={form.watch} />
          <div className="mt-4 flex justify-end">
            <StyledButton type="submit">Follow</StyledButton>
          </div>
        </form>
      </Form>
    </div>
  )
}

const PreviewUrl: FC<{
  watch: UseFormReturn<any>["watch"]
}> = ({ watch }) => {
  const data = watch()

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
