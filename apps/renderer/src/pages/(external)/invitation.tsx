import { IN_ELECTRON } from "@follow/shared/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import type { DotLottie } from "@lottiefiles/dotlottie-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { m } from "framer-motion"
import type { RefCallback } from "react"
import { useEffect, useState } from "react"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { SocialMediaLinks } from "~/constants/social"
import { useSignOut } from "~/hooks/biz/useSignOut"
import { tipcClient } from "~/lib/client"
import { getFetchErrorMessage } from "~/lib/error-parser"
import confettiUrl from "~/lottie/confetti.lottie?url"
import { useInvitationMutation } from "~/queries/invitations"

const absoluteConfettiUrl = new URL(confettiUrl, import.meta.url).href

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

  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (invitationMutation.isSuccess) {
      setShowConfetti(true)
    }
  }, [invitationMutation.isSuccess])
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null)

  useEffect(() => {
    function onComplete() {
      navigate("/")
    }

    if (dotLottie) {
      dotLottie.addEventListener("complete", onComplete)
    }

    return () => {
      if (dotLottie) {
        dotLottie.removeEventListener("complete", onComplete)
      }
    }
  }, [dotLottie, navigate])

  const dotLottieRefCallback: RefCallback<DotLottie> = (dotLottie) => {
    setDotLottie(dotLottie)
  }

  const signOut = useSignOut()

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
          <div className="center relative flex">
            {showConfetti && (
              <DotLottieReact
                className="absolute size-[120px]"
                src={absoluteConfettiUrl}
                loop={false}
                autoplay
                dotLottieRefCallback={dotLottieRefCallback}
              />
            )}
            <Button
              variant={showConfetti ? "outline" : "primary"}
              type="submit"
              disabled={!form.formState.isValid}
              isLoading={invitationMutation.isPending}
            >
              {showConfetti && (
                <m.i
                  initial={{ y: 5 }}
                  animate={{
                    y: 0,
                  }}
                  className="i-mgc-check-circle-filled mr-2 text-green-500"
                />
              )}
              {t("invitation.activate")}
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  buttonClassName="absolute -right-2 -top-1 text-foreground/80"
                  className="size-8 text-lg"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    if (IN_ELECTRON) {
                      tipcClient?.clearAllData().then(() => {
                        window.location.href = "/"
                      })
                    } else {
                      signOut()
                    }
                  }}
                >
                  <i className="i-mingcute-exit-door-line" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("login.signOut")}</TooltipContent>
            </Tooltip>
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
