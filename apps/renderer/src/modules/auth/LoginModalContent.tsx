import { m } from "framer-motion"
import { useTranslation } from "react-i18next"

import { FollowIcon } from "~/components/icons/follow"
import { Button } from "~/components/ui/button"
import { useCurrentModal } from "~/components/ui/modal"
import { modalMontionConfig } from "~/components/ui/modal/stacked/constants"
import type { LoginRuntime } from "~/lib/auth"
import { loginHandler } from "~/lib/auth"
import { stopPropagation } from "~/lib/dom"

interface LoginModalContentProps {
  runtime?: LoginRuntime
  canClose?: boolean
}
export const LoginModalContent = (props: LoginModalContentProps) => {
  const modal = useCurrentModal()

  const { canClose = true, runtime } = props

  const { t } = useTranslation()

  return (
    <div className="center flex h-full" onClick={canClose ? modal.dismiss : undefined}>
      <m.div
        className="shadow-modal rounded-lg border border-border bg-theme-background p-4 px-8 pb-8"
        onClick={stopPropagation}
        {...modalMontionConfig}
      >
        <div className="mb-8 mt-4 text-center align-middle font-sans text-2xl font-bold leading-relaxed">
          <span className="text-xl">{t("signin.sign_in_to")}</span>
          <span className="center flex translate-y-px gap-2 font-theme text-accent">
            <FollowIcon className="size-4" />
            {APP_NAME}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            className="h-[48px] w-[320px] rounded-[8px] !bg-black font-sans text-base text-white hover:!bg-black/80 focus:!border-black/80 focus:!ring-black/80"
            onClick={() => {
              loginHandler("github", runtime)
            }}
          >
            <i className="i-mgc-github-cute-fi mr-2 text-xl" /> {t("signin.continue_with_github")}
          </Button>
          <Button
            className="h-[48px] w-[320px] rounded-[8px] bg-blue-500 font-sans text-base text-white hover:bg-blue-500/90 focus:!border-blue-500/80 focus:!ring-blue-500/80"
            onClick={() => {
              loginHandler("google", runtime)
            }}
          >
            <i className="i-mgc-google-cute-fi mr-2 text-xl" /> {t("signin.continue_with_google")}
          </Button>
        </div>
      </m.div>
    </div>
  )
}
