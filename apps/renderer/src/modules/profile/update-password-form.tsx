import { Button } from "@follow/components/ui/button/index.js"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@follow/components/ui/form/index.jsx"
import { Input } from "@follow/components/ui/input/index.js"
import { Label } from "@follow/components/ui/label/index.js"
import { changePassword } from "@follow/shared/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useHasPassword } from "~/queries/auth"

const passwordSchema = z.string().min(8).max(128)

const updatePasswordFormSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const UpdateExistingPasswordForm = () => {
  const { t } = useTranslation("settings")

  const form = useForm<z.infer<typeof updatePasswordFormSchema>>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof updatePasswordFormSchema>) => {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      })
      if (res.error) {
        throw new Error(res.error.message)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (_) => {
      toast(t("profile.update_password_success"), {
        duration: 3000,
      })
      form.reset()
    },
  })

  function onSubmit(values: z.infer<typeof updatePasswordFormSchema>) {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[35ch] max-w-full space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoFocus
                  type="password"
                  placeholder={t("profile.current_password.label")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder={t("profile.new_password.label")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("profile.confirm_password.label")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button type="submit" isLoading={updateMutation.isPending}>
            {t("profile.submit")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export const UpdatePasswordForm = () => {
  const { data: hasPassword, isLoading } = useHasPassword()

  const { t } = useTranslation("settings")
  const { present } = useModalStack()
  if (isLoading || !hasPassword) {
    return null
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <Label className="mb-4">{t("profile.password.label")}</Label>
      <Button
        variant="outline"
        onClick={() =>
          present({
            title: t("profile.change_password.label"),
            content: UpdateExistingPasswordForm,
          })
        }
      >
        {t("profile.change_password.label")}
      </Button>
    </div>
  )
}
