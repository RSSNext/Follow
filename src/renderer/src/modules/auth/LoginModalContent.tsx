import { FollowIcon } from "@renderer/components/icons/follow"
import { Button } from "@renderer/components/ui/button"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { modalMontionConfig } from "@renderer/components/ui/modal/stacked/constants"
import type { LoginRuntime } from "@renderer/lib/auth"
import { loginHandler } from "@renderer/lib/auth"
import { stopPropagation } from "@renderer/lib/dom"
import { m } from "framer-motion"

interface LoginModalContentProps {
  runtime?: LoginRuntime
}
export const LoginModalContent = (props: LoginModalContentProps) => {
  const modal = useCurrentModal()
  return (
    <div className="center flex h-full" onClick={modal.dismiss}>
      <m.div
        className="shadow-modal rounded-lg border border-border bg-theme-background p-4 px-8 pb-8"
        onClick={stopPropagation}
        {...modalMontionConfig}
      >
        <div className="mb-8 mt-4 text-center align-middle font-sans text-2xl font-bold leading-relaxed">
          <span className="text-xl">Sign in to </span>
          <span className="center flex translate-y-px gap-2 font-theme text-theme-accent">
            <FollowIcon className="size-4" />
            {APP_NAME}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            className="h-[48px] w-[320px] rounded-[8px] !bg-black font-sans text-base text-white hover:!bg-black/80"
            size="lg"
            onClick={() => {
              loginHandler("github", props.runtime)
            }}
          >
            <i className="i-mgc-github-cute-fi mr-2 text-xl" />
            {" "}
            Continue with
            GitHub
          </Button>
          <Button
            className="h-[48px] w-[320px] rounded-[8px] bg-blue-500 font-sans text-base text-white hover:bg-blue-500/90"
            size="xl"
            onClick={() => {
              loginHandler("google", props.runtime)
            }}
          >
            <i className="i-mgc-google-cute-fi mr-2 text-xl" />
            {" "}
            Continue with
            Google
          </Button>
        </div>
      </m.div>
    </div>
  )
}
