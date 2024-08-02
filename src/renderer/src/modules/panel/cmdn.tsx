import { zodResolver } from "@hookform/resolvers/zod"
import { getSidebarActiveView } from "@renderer/atoms/sidebar"
import { m } from "@renderer/components/common/Motion"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@renderer/components/ui/form"
import { useModalStack } from "@renderer/components/ui/modal"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import { HotKeyScopeMap } from "@renderer/constants"
import type { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import { useForm } from "react-hook-form"
import { useHotkeys } from "react-hotkeys-hook"
import { z } from "zod"

import { FeedForm } from "../discover/feed-form"

const CmdNPanel = () => {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        url: z.string().url(),
      }),
    ),
    mode: "all",
  })

  const { present, dismissAll } = useModalStack()

  const handleSubmit = () => {
    const { url } = form.getValues()

    const defaultView = getSidebarActiveView() as FeedViewType
    present({
      title: "Add Feed",
      content: () => (
        <FeedForm
          asWidget
          url={url}
          defaultView={defaultView}
          onSuccess={dismissAll}
        />
      ),
    })
  }

  return (
    <Form {...form}>
      <m.form
        exit={{ opacity: 0 }}
        className={cn(
          "w-[700px] max-w-[100vw] rounded-none md:max-w-[80vw]",
          "flex flex-col bg-zinc-50/85 shadow-2xl backdrop-blur-md dark:bg-neutral-900/80 md:rounded-full",
          "border-0 border-zinc-200 dark:border-zinc-800 md:border",
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pr-8",
          "z-10",
        )}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input
                  {...field}
                  placeholder="Quick follow a feed, typing feed url here..."
                  className="w-full shrink-0 border-b border-zinc-200 bg-transparent p-4 px-5 text-lg leading-4 dark:border-neutral-700"
                />
              </FormControl>
            </FormItem>
          )}
          control={form.control}
          name="url"
        />

        <button
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          type="submit"
          className="center absolute inset-y-0 right-3 pl-2 text-theme-accent duration-200 hover:text-theme-accent/90 disabled:grayscale"
        >
          <i className="i-mgc-arrow-right-circle-cute-fi size-6" />
        </button>
      </m.form>
    </Form>
  )
}

export const CmdNTrigger = () => {
  const { present } = useModalStack()
  useHotkeys(
    "meta+n,ctrl+n",
    (e) => {
      e.preventDefault()
      present({
        title: "Quick Follow",
        content: CmdNPanel,
        CustomModalComponent: NoopChildren,
        overlay: false,
        clickOutsideToDismiss: true,
      })
    },
    { scopes: HotKeyScopeMap.Home },
  )

  return null
}
