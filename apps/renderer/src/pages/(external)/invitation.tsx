import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { Logo } from "~/components/icons/logo"
import { Button } from "~/components/ui/button"
import { styledButtonVariant } from "~/components/ui/button/variants"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { SocialMediaLinks } from "~/constants/social"
import { getFetchErrorMessage } from "~/lib/error-parser"
import { useInvitationMutation } from "~/queries/invitations"

const formSchema = z.object({
  code: z.string().min(1),
})

export function Component() {
  const { t } = useTranslation("external")
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const invitationMutation = useInvitationMutation({
    onError(error) {
      const message = getFetchErrorMessage(error)
      form.setError("code", { message })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    invitationMutation.mutate(values.code)
  }

  useEffect(() => {
    if (invitationMutation.isSuccess) {
      navigate("/")
    }
  }, [invitationMutation.isSuccess, navigate])

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center gap-14">
      <Logo className="size-20" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[512px] max-w-full">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center gap-2 md:block">
                <FormLabel>{t("invitation.title")}</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} />
                </FormControl>
                <div className="h-6">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="center flex">
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              isLoading={invitationMutation.isPending}
            >
              {t("invitation.activate")}
            </Button>
          </div>
        </form>
      </Form>
      <div className="space-y-2 text-balance text-center text-sm text-zinc-600 md:text-left">
        <p>{t("invitation.earlyAccessMessage")}</p>
        <p>{t("invitation.getCodeMessage")}</p>
        <p>
          <p>1. {t("invitation.codeOptions.1")}</p>
          <p>2. {t("invitation.codeOptions.2")}</p>
          <p>3. {t("invitation.codeOptions.3")}</p>
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {SocialMediaLinks.map((link) => (
          <span
            key={link.url}
            className={styledButtonVariant({
              variant: "outline",
              className: "flex-1",
            })}
          >
            <a
              href={link.url}
              className="center flex w-full gap-1"
              target="_blank"
              rel="noreferrer"
            >
              <i className={link.icon} />
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  )
}
