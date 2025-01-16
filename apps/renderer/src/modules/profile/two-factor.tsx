import { Button } from "@follow/components/ui/button/index.js"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@follow/components/ui/form/index.jsx"
import { Input, InputOTP, InputOTPGroup, InputOTPSlot } from "@follow/components/ui/input/index.js"
import { Label } from "@follow/components/ui/label/index.js"
import { twoFactor } from "@follow/shared/auth"
import { cn } from "@follow/utils/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { m, useAnimation } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import QRCode from "react-qr-code"
import { toast } from "sonner"
import { z } from "zod"

import { setWhoami, useWhoami } from "~/atoms/user"
import { useCurrentModal, useModalStack } from "~/components/ui/modal/stacked/hooks"
import { getFetchErrorMessage } from "~/lib/error-parser"
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

export type PasswordFormProps<T, V> = {
  valueType: T
  onSubmitMutationFn: (values: V) => Promise<void>
  message?: {
    placeholder?: string
    label?: string
  }
  onSuccess?: () => void
}

const shakeVariants = {
  shake: {
    x: [0, -2, 2, -2, 2, 0],
    transition: {
      duration: 0.5,
    },
  },
  reset: {
    x: 0,
  },
}

export function PasswordForm<
  T extends "password" | "totp",
  V extends T extends "password" ? PasswordFormValues : TOTPFormValues,
>({ valueType, message, onSubmitMutationFn, onSuccess }: PasswordFormProps<T, V>) {
  const isPassword = valueType === "password"
  const { t } = useTranslation("settings")
  const controls = useAnimation()

  const form = useForm<V>({
    resolver: zodResolver(isPassword ? passwordFormSchema : totpFormSchema),
    defaultValues: (isPassword ? { password: "" } : { code: "" }) as any,
  })

  const updateMutation = useMutation({
    mutationFn: onSubmitMutationFn,
    onError: (error) => {
      const fetchErrorMessage = getFetchErrorMessage(error)
      if (
        !isPassword &&
        (error.message === "invalid two factor authentication" ||
          fetchErrorMessage === "Invalid two factor code")
      ) {
        form.resetField("code" as any)
        form.setError("code" as any, {
          type: "manual",
          message: t("profile.totp_code.invalid"),
        })
        controls.start("shake")
      } else {
        toast.error(error.message)
      }
    },
    onSuccess,
  })

  function onSubmit(values: V) {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[35ch] max-w-full space-y-4">
        <FormField
          control={form.control}
          name={(isPassword ? "password" : "code") as any}
          render={({ field }) => (
            <FormItem className={cn("flex flex-col", !isPassword ? "items-center" : "")}>
              <FormLabel className="shrink-0">
                {message?.label ??
                  (isPassword ? t("profile.current_password.label") : t("profile.totp_code.label"))}
              </FormLabel>
              <FormControl>
                {isPassword ? (
                  <Input
                    disabled={updateMutation.isPending}
                    autoFocus
                    type="password"
                    placeholder={message?.placeholder ?? t("profile.current_password.label")}
                    {...field}
                  />
                ) : (
                  <m.div
                    variants={shakeVariants}
                    animate={controls}
                    className="flex justify-center"
                  >
                    <InputOTP
                      disabled={updateMutation.isPending}
                      autoFocus
                      className="!w-full"
                      maxLength={6}
                      onComplete={() => form.handleSubmit(onSubmit)()}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </m.div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isPassword && (
          <div className="text-right">
            <Button type="submit" isLoading={updateMutation.isPending}>
              {t("profile.submit")}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}

const TwoFactorForm = () => {
  const { t } = useTranslation("settings")
  const modal = useCurrentModal()
  const user = useWhoami()
  const [totpURI, setTotpURI] = useState("")
  return totpURI ? (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center">
        <QRCode value={totpURI} />
      </div>
      <PasswordForm
        valueType="totp"
        message={{
          label: t("profile.totp_code.init"),
        }}
        onSubmitMutationFn={async (values) => {
          const res = await twoFactor.verifyTotp({ code: values.code })
          if (res.error) {
            throw new Error(res.error.message)
          }
          toast.success(t("profile.two_factor.enabled"))
          modal.dismiss()
          setWhoami((prev) => {
            if (!prev) return prev
            return { ...prev, twoFactorEnabled: true }
          })
        }}
      />
    </div>
  ) : (
    <PasswordForm
      valueType="password"
      onSubmitMutationFn={async (values) => {
        const res = user?.twoFactorEnabled
          ? await twoFactor.disable({ password: values.password })
          : await twoFactor.enable({ password: values.password })
        if (res.error) {
          throw new Error(res.error.message)
        }
        if ("totpURI" in res.data) {
          setTotpURI(res.data?.totpURI ?? "")
        } else {
          toast.success(t("profile.two_factor.disabled"))
          modal.dismiss()
          setWhoami((prev) => {
            if (!prev) return prev
            return { ...prev, twoFactorEnabled: false }
          })
        }
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

  const { data: hasPassword, isLoading } = useHasPassword()

  return (
    <div className="flex items-center justify-between">
      <Label>{t("profile.two_factor.label")}</Label>
      {isLoading ? null : hasPassword ? (
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
