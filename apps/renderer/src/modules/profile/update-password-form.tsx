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
import { changePassword } from "@follow/shared/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { apiClient } from "~/lib/api-fetch"
import { toastFetchError } from "~/lib/error-parser"
import { Queries } from "~/queries"
import { useHasPassword } from "~/queries/auth"

const passwordSchema = z.string().min(8).max(128)
const initPasswordFormSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const InitPasswordForm = () => {
  const { t } = useTranslation("settings")

  const form = useForm<z.infer<typeof initPasswordFormSchema>>({
    resolver: zodResolver(initPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof initPasswordFormSchema>) => {
      await apiClient.profiles["init-password"].$patch({
        json: { password: values.newPassword },
      })
      await Queries.auth.getAccounts().invalidate()
    },
    onError: (error) => {
      toastFetchError(error)
    },
    onSuccess: (_) => {
      toast(t("profile.update_password_success"), {
        duration: 3000,
      })
      form.reset()
    },
  })

  function onSubmit(values: z.infer<typeof initPasswordFormSchema>) {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.change_password.label")}</FormLabel>
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

  if (isLoading) {
    return null
  }

  if (!hasPassword) {
    return <InitPasswordForm />
  }
  return <UpdateExistingPasswordForm />
}
