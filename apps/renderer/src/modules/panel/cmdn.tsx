import { Form, FormControl, FormField, FormItem } from "@follow/components/ui/form/index.jsx"
import type { FeedViewType } from "@follow/constants"
import { useRegisterGlobalContext } from "@follow/shared/bridge"
import { cn } from "@follow/utils/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLayoutEffect } from "react"
import { useForm } from "react-hook-form"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { getSidebarActiveView } from "~/atoms/sidebar"
import { m } from "~/components/common/Motion"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { HotKeyScopeMap } from "~/constants"
import { tipcClient } from "~/lib/client"

import { FeedForm } from "../discover/feed-form"

const CmdNPanel = () => {
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(
      z.object({
        url: z.string().url(),
      }),
    ),

    mode: "all",
  })

  useLayoutEffect(() => {
    tipcClient?.readClipboard().then((clipboardText) => {
      if (clipboardText) {
        form.setValue("url", clipboardText)
        form.control._updateValid()
      }
    })
  }, [])

  const { present, dismissAll } = useModalStack()

  const handleSubmit = () => {
    const { url } = form.getValues()

    const defaultView = getSidebarActiveView() as FeedViewType

    window.analytics?.capture("quick_add_feed", { url, defaultView })

    present({
      title: t("feed_form.add_feed"),
      content: () => (
        <FeedForm
          asWidget
          url={url}
          defaultValues={{
            view: defaultView.toString(),
          }}
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
                  placeholder={t("quick_add.placeholder")}
                  className="w-full shrink-0 border-zinc-200 bg-transparent p-4 px-5 text-lg leading-4 dark:border-neutral-700"
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
          className="center absolute inset-y-0 right-3 pl-2 text-accent duration-200 hover:text-accent/90 disabled:grayscale"
        >
          <i className="i-mgc-arrow-right-circle-cute-fi size-6" />
        </button>
      </m.form>
    </Form>
  )
}

export const CmdNTrigger = () => {
  const { t } = useTranslation()
  const { present } = useModalStack()
  const handler = () => {
    present({
      title: t("quick_add.title"),
      content: CmdNPanel,
      CustomModalComponent: PlainModal,
      overlay: false,
      id: "quick-add",
      clickOutsideToDismiss: true,
    })
  }

  useRegisterGlobalContext("quickAdd", handler)

  useHotkeys("meta+n,ctrl+n", handler, {
    scopes: HotKeyScopeMap.Home,
    preventDefault: true,
  })

  return null
}
