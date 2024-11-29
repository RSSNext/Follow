import { FollowIcon } from "@follow/components/icons/follow.jsx"
import { MotionButtonBase } from "@follow/components/ui/button/index.js"
import { LoadingCircle } from "@follow/components/ui/loading/index.jsx"
import { authProvidersConfig } from "@follow/constants"
import { stopPropagation } from "@follow/utils/dom"
import clsx from "clsx"
import { AnimatePresence, m } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { modalMontionConfig } from "~/components/ui/modal/stacked/constants"
import { useCurrentModal } from "~/components/ui/modal/stacked/hooks"
import type { LoginRuntime } from "~/lib/auth"
import { loginHandler } from "~/lib/auth"
import { useAuthProviders } from "~/queries/users"

interface LoginModalContentProps {
  runtime?: LoginRuntime
  canClose?: boolean
}
export const LoginModalContent = (props: LoginModalContentProps) => {
  const modal = useCurrentModal()

  const { canClose = true, runtime } = props

  const { t } = useTranslation()
  const { data: authProviders } = useAuthProviders()

  const [loadingLockSet, _setLoadingLockSet] = useState<string>("")

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const setLoadingLockSet = (id: string) => {
    _setLoadingLockSet(id)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      _setLoadingLockSet("")
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const disabled = !!loadingLockSet
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
          {Object.entries(authProviders || []).map(([key, provider]) => (
            <MotionButtonBase
              key={key}
              className={clsx(
                "center h-[48px] w-[320px] rounded-[8px] font-sans text-base font-medium text-white",
                disabled && "pointer-events-none opacity-50",
                "overflow-hidden",
                authProvidersConfig[key]?.buttonClassName,
              )}
              disabled={disabled}
              onClick={() => {
                loginHandler(key, runtime)
                setLoadingLockSet(key)
                window.analytics?.capture("login", {
                  type: key,
                })
              }}
            >
              <LoginButtonContent isLoading={loadingLockSet === key}>
                <i className={clsx("mr-2 text-xl", authProvidersConfig[key].iconClassName)} />{" "}
                {t("signin.continue_with", { provider: provider.name })}
              </LoginButtonContent>
            </MotionButtonBase>
          ))}
        </div>
      </m.div>
    </div>
  )
}

const LoginButtonContent = (props: { children: React.ReactNode; isLoading: boolean }) => {
  const { children, isLoading } = props
  return (
    <AnimatePresence mode="popLayout">
      {isLoading ? (
        <m.div
          animate={{
            y: 0,
            opacity: 1,
          }}
          initial={{
            y: -30,
            opacity: 0,
          }}
          transition={{
            type: "spring",
          }}
          key="loading"
          className="contents"
        >
          <LoadingCircle size={"medium"} />
        </m.div>
      ) : (
        <m.div
          key="text"
          className="center whitespace-nowrap"
          transition={{
            type: "spring",
          }}
          exit={{
            y: "-100%",
            opacity: 0,
          }}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  )
}
