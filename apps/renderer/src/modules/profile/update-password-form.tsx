import { Button } from "@follow/components/ui/button/index.js"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@follow/components/ui/form/index.jsx"
import { Input } from "@follow/components/ui/input/index.js"
import { changePassword, forgetPassword } from "@follow/shared/auth"
import { env } from "@follow/shared/env"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { useWhoami } from "~/atoms/user"
import { useHasPassword } from "~/queries/auth"

// eslint-disable-next-line unused-imports/no-unused-vars
const ForgetPasswordButton = () => {
  const { t } = useTranslation("settings")
  const user = useWhoami()
  const forgetPasswordMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("No user found")
      }
      const res = await forgetPassword({
        email: user.email,
        redirectTo: `${env.VITE_WEB_URL}/reset-password`,
      })
      if (res.error) {
        throw new Error(res.error.message)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast(t("profile.reset_password_mail_sent"), {
        duration: 3000,
      })
    },
  })

  return (
    <Button
      onClick={() => {
        forgetPasswordMutation.mutate()
      }}
      isLoading={forgetPasswordMutation.isPending}
    >
      {t("profile.forget_password")}
    </Button>
  )
}

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.change_password.label")}</FormLabel>
              <FormControl>
                <Input
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

  if (isLoading || !hasPassword) {
    return null
  }

  // if (!hasPassword) {
  //   return <ForgetPasswordButton />
  // }
  return <UpdateExistingPasswordForm />
}
