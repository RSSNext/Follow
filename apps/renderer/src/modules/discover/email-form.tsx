import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { INBOXES_EMAIL_DOMAIN } from "~/constants"
import { apiClient } from "~/lib/api-fetch"
import { FeedViewType } from "~/lib/enum"
import { cn } from "~/lib/utils"
import { inboxActions, useInboxByView } from "~/store/inbox"
import { subscriptionActions } from "~/store/subscription"

const formSchema = z.object({
  handle: z
    .string()
    .min(1)
    .max(32)
    .regex(/^[\w-]+$/),
})

export function DiscoverEmail({
  fullWidth,
  onSuccess,
}: {
  fullWidth?: boolean
  onSuccess?: () => void
}) {
  const { t } = useTranslation()
  const inboxes = useInboxByView(FeedViewType.Articles)
  const hasInbox = inboxes.length > 0
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (hasInbox) {
      form.setValue("handle", inboxes?.[0]?.id)
    }
  }, [form, hasInbox, inboxes])

  const mutationCreate = useMutation({
    mutationFn: async (handle: string) => {
      await apiClient.inboxes.$post({
        json: {
          handle,
        },
      })
    },
  })

  const mutationChange = useMutation({
    mutationFn: async (handle: string) => {
      await apiClient.inboxes.$put({
        json: {
          handle,
        },
      })
      onSuccess?.()
    },
  })

  const mutationDestroy = useMutation({
    mutationFn: async () => {
      await apiClient.inboxes.$delete()
      onSuccess?.()
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (hasInbox) {
      mutationChange.mutate(values.handle)
    } else {
      mutationCreate.mutate(values.handle)
    }
  }

  useEffect(() => {
    if (mutationChange.isSuccess) {
      inboxActions.clear()
      subscriptionActions.fetchByView(FeedViewType.Articles)
      toast.success(t("discover.email_change_success"))
    }
  }, [mutationChange.isSuccess, t])

  useEffect(() => {
    if (mutationChange.isError) {
      toast.error(t("discover.email_change_error"))
    }
  }, [mutationChange.isError, t])

  useEffect(() => {
    if (mutationCreate.isSuccess) {
      subscriptionActions.fetchByView(FeedViewType.Articles)
      toast.success(t("discover.email_create_success"))
    }
  }, [mutationCreate.isSuccess, t])

  useEffect(() => {
    if (mutationCreate.isError) {
      toast.error(t("discover.email_create_error"))
    }
  }, [mutationCreate.isError, t])

  useEffect(() => {
    if (mutationDestroy.isSuccess) {
      inboxActions.clear()
      toast.success(t("discover.email_destroy_success"))
    }
  }, [mutationDestroy.isSuccess, t])

  useEffect(() => {
    if (mutationDestroy.isError) {
      toast.error(t("discover.email_destroy_error"))
    }
  }, [mutationDestroy.isError, t])

  return (
    <>
      <div className={cn("mb-4 text-sm font-medium", hasInbox ? "text-red-600" : "text-amber-600")}>
        {t(hasInbox ? "discover.email_change_description" : "discover.email_create_description")}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("w-[512px] space-y-8", fullWidth && "w-full")}
          data-testid="discover-form"
        >
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("discover.email_handle")}</FormLabel>
                <FormControl>
                  <div className={cn("flex w-64 items-center gap-2")}>
                    <Input autoFocus {...field} />
                    <span className="text-zinc-500">{`@${INBOXES_EMAIL_DOMAIN}`}</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className={cn("center flex gap-4", fullWidth && "justify-end")}
            data-testid="discover-form-actions"
          >
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              isLoading={mutationCreate.isPending}
              className={!!form.formState.isValid && hasInbox ? "bg-red-600" : ""}
            >
              {t(hasInbox ? "discover.email_change" : "discover.email_create")}
            </Button>
            {hasInbox && (
              <Button
                className="bg-red-600"
                onClick={() => {
                  mutationDestroy.mutate()
                }}
              >
                {t("discover.email_destroy")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
