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
import { env } from "@follow/shared/env"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { useHasPassword } from "~/queries/auth"

export const NoPasswordHint = ({ i18nKey }: { i18nKey: string }) => {
  return (
    <p className="text-sm text-muted-foreground">
      <Trans
        ns="settings"
        i18nKey={i18nKey as any}
        components={{
          Link: (
            <a
              href={`${env.VITE_WEB_URL}/forget-password`}
              className="text-accent"
              target="_blank"
            />
          ),
        }}
      />
    </p>
  )
}

const passwordSchema = z.string().min(8).max(128)
const passwordFormSchema = z.object({
  password: passwordSchema,
})
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export type PasswordFormProps<V> = {
  onSubmitMutationFn: (values: V) => Promise<void>
  message?: {
    placeholder?: string
    label?: string
  }
  onSuccess?: () => void
}

export function PasswordForm({
  message,
  onSubmitMutationFn,
  onSuccess,
}: PasswordFormProps<PasswordFormValues>) {
  const { data: hasPassword, isLoading } = useHasPassword()
  const { t } = useTranslation("settings")

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { password: "" },
  })

  const updateMutation = useMutation({
    mutationFn: onSubmitMutationFn,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess,
  })

  function onSubmit(values: PasswordFormValues) {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[35ch] max-w-full space-y-4">
        <FormField
          control={form.control}
          name={"password"}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="shrink-0">
                {message?.label ?? t("profile.current_password.label")}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={updateMutation.isPending}
                  autoFocus
                  type="password"
                  placeholder={message?.placeholder ?? t("profile.current_password.label")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!hasPassword && !isLoading && <NoPasswordHint i18nKey="profile.two_factor.no_password" />}

        <div className="text-right">
          <Button type="submit" isLoading={updateMutation.isPending}>
            {t("profile.submit")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
