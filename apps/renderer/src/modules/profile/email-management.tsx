import { Button } from "@follow/components/ui/button/index.js"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@follow/components/ui/form/index.js"
import { Input } from "@follow/components/ui/input/Input.js"
import { changeEmail, sendVerificationEmail } from "@follow/shared/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { setWhoami, useWhoami } from "~/atoms/user"

const formSchema = z.object({
  email: z.string().email(),
})

export function EmailManagement() {
  const { t } = useTranslation("settings")
  const user = useWhoami()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
    },
  })

  const updateEmailMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const res = await changeEmail({ newEmail: values.email })
      if (res.error) {
        throw new Error(res.error.message)
      }
    },
    onSuccess: (_, variables) => {
      if (user?.emailVerified) {
        toast.success(t("profile.email.changed_verification_sent"))
      } else {
        if (user) {
          setWhoami({
            ...user,
            email: variables.email,
          })
        }
        form.reset({ email: variables.email })
        toast.success(t("profile.email.changed"))
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) return
      return sendVerificationEmail({
        email: user.email,
      })
    },
    onSuccess: () => {
      toast.success(t("profile.email.verification_sent"))
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          updateEmailMutation.mutate(values)
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.email.label")}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-x-2">
                  <Input {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-x-2 text-right">
          {!user?.emailVerified && !form.formState.isDirty && (
            <Button
              variant="outline"
              type="button"
              isLoading={verifyEmailMutation.isPending}
              onClick={() => {
                verifyEmailMutation.mutate()
              }}
            >
              {t("profile.email.send_verification")}
            </Button>
          )}
          <Button
            type="submit"
            isLoading={updateEmailMutation.isPending}
            disabled={updateEmailMutation.isPending || !form.formState.isDirty}
          >
            {t("profile.email.change")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
