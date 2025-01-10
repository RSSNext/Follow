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
import { Label } from "@follow/components/ui/label/index.js"
import { twoFactor } from "@follow/shared/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import QRCode from "react-qr-code"
import { toast } from "sonner"
import { z } from "zod"

import { useWhoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useHasPassword } from "~/queries/auth"

import { NoPasswordHint } from "./update-password-form"

const passwordSchema = z.string().min(8).max(128)
const totpCodeSchema = z.string().length(6).regex(/^\d+$/)

const passwordFormSchema = z.object({
  password: passwordSchema,
})
type PasswordFormValues = z.infer<typeof passwordFormSchema>

const totpFormSchema = z.object({
  code: totpCodeSchema,
})
type TOTPFormValues = z.infer<typeof totpFormSchema>

function PasswordForm<
  T extends "password" | "totp",
  Value extends T extends "password" ? PasswordFormValues : TOTPFormValues,
>({ onSubmitMutationFn, type }: { onSubmitMutationFn: (values: Value) => Promise<void>; type: T }) {
  const { t } = useTranslation("settings")

  const form = useForm<Value>({
    resolver: zodResolver(type === "password" ? passwordFormSchema : totpFormSchema),
    defaultValues: (type === "password" ? { password: "" } : { code: "" }) as any,
  })

  const updateMutation = useMutation({
    mutationFn: onSubmitMutationFn,
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function onSubmit(values: Value) {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[35ch] max-w-full space-y-4">
        <FormField
          control={form.control}
          name={(type === "password" ? "password" : "code") as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.current_password.label")}</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  type={type === "password" ? "password" : "text"}
                  placeholder={t("profile.current_password.label")}
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

const TwoFactorForm = () => {
  const user = useWhoami()
  const [totpURI, setTotpURI] = useState("")
  return totpURI ? (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center">
        <QRCode value={totpURI} />
      </div>
      <PasswordForm
        type="totp"
        onSubmitMutationFn={async (values) => {
          const res = await twoFactor.verifyTotp({ code: values.code })
          if (res.error) {
            throw new Error(res.error.message)
          }
          toast.success("Two-factor authentication enabled")
        }}
      />
    </div>
  ) : (
    <PasswordForm
      type="password"
      onSubmitMutationFn={async (values) => {
        const res = user?.twoFactorEnabled
          ? await twoFactor.disable({ password: values.password })
          : await twoFactor.enable({ password: values.password })
        if (res.error) {
          throw new Error(res.error.message)
        }
        if ("totpURI" in res.data) setTotpURI(res.data?.totpURI ?? "")
      }}
    />
  )
}

export function TwoFactor() {
  const { t } = useTranslation("settings")
  const { present } = useModalStack()
  const user = useWhoami()
  const actionTitle = user?.twoFactorEnabled
    ? t("profile.two_factor.disable")
    : t("profile.two_factor.enable")

  const { data: hasPassword } = useHasPassword()

  return (
    <div className="flex items-center justify-between">
      <Label>{t("profile.two_factor.label")}</Label>
      {hasPassword ? (
        <Button
          variant="outline"
          onClick={() => {
            present({
              title: actionTitle,
              content: TwoFactorForm,
            })
          }}
        >
          {actionTitle}
        </Button>
      ) : (
        <NoPasswordHint i18nKey="profile.two_factor.no_password" />
      )}
    </div>
  )
}
