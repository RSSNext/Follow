import clsx from "clsx"
import { AnimatePresence, m } from "framer-motion"
import type { ComponentProps, FunctionComponentElement } from "react"
import { createElement, useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Logo } from "~/components/icons/logo"
import { Button } from "~/components/ui/button"
import { mountLottie } from "~/components/ui/lottie-container"
import { useI18n } from "~/hooks/common"
import confettiUrl from "~/lottie/confetti.lottie?url"
import { settings } from "~/queries/settings"

import { settingSyncQueue } from "../settings/helper/sync-queue"
import { useHaveUsedOtherRSSReader } from "./atoms"
import { AppearanceGuide } from "./steps/appearance"
import { BehaviorGuide } from "./steps/behavior"
import { TrendingFeeds } from "./steps/feeds"
import { RookieCheck } from "./steps/rookie"

const containerWidth = 600
const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? containerWidth : -containerWidth,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? containerWidth : -containerWidth,
      opacity: 0,
    }
  },
}

function Intro() {
  const { t } = useTranslation("app")
  return (
    <div className="mb-20 w-[50ch] text-balance pt-14 text-center">
      <Logo className="mx-auto size-20" />
      <p className="mt-5 text-xl font-semibold">{t("new_user_guide.intro.title")}</p>
      <p className="text-lg">{t("new_user_guide.intro.description")}</p>
    </div>
  )
}

function Outtro() {
  const { t } = useTranslation("app")
  return (
    <div className="mb-20 w-[50ch] text-balance pt-14 text-center">
      <Logo className="mx-auto size-20" />
      <p className="mt-5 text-xl font-semibold">{t("new_user_guide.outro.title")}</p>
      <p className="text-lg">{t("new_user_guide.outro.description")}</p>
    </div>
  )
}
const absoluteConfettiUrl = new URL(confettiUrl, import.meta.url).href
export function GuideModalContent({ onClose }: { onClose: () => void }) {
  const t = useI18n()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const haveUsedOtherRSSReader = useHaveUsedOtherRSSReader()

  const guideSteps = useMemo(
    () =>
      [
        {
          title: t.settings("appearance.sidebar_title"),
          content: createElement(AppearanceGuide),
          icon: "i-mgc-palette-cute-re",
        },
        {
          title: t.app("new_user_guide.step.start_question.title"),
          content: createElement(RookieCheck),
          icon: "i-mgc-question-cute-re",
        },
        haveUsedOtherRSSReader && {
          title: t.app("new_user_guide.step.behavior.title"),
          content: createElement(BehaviorGuide),
          icon: tw`i-mingcute-cursor-3-line`,
        },
        {
          title: "Popular Feeds",
          content: createElement(TrendingFeeds),
          icon: "i-mgc-trending-up-cute-re",
        },
      ].filter((i) => !!i) as {
        title: string
        icon: string
        content: FunctionComponentElement<object>
      }[],
    [haveUsedOtherRSSReader, t],
  )

  const totalSteps = useMemo(() => guideSteps.length, [guideSteps])

  const status = useMemo(
    () => (step === 0 ? "initial" : step > 0 && step <= totalSteps ? "active" : "complete"),
    [step, totalSteps],
  )

  const title = useMemo(() => guideSteps[step - 1]?.title, [guideSteps, step])

  const finishGuide = useCallback(() => {
    settingSyncQueue.replaceRemote().then(() => {
      settings.get().invalidate()
    })
  }, [])

  return (
    <m.div
      layout
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border bg-theme-background"
    >
      {!!title && (
        <h1 className="absolute left-6 top-4 text-xl font-bold">
          <i className={clsx(guideSteps[step - 1].icon, "mr-2 size-[22px] translate-y-1")} />
          {title}
        </h1>
      )}

      <div className="relative mx-auto flex w-full max-w-lg items-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.div
            key={step - 1}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.1 },
            }}
          >
            {status === "initial" ? (
              <Intro />
            ) : status === "active" ? (
              guideSteps[step - 1].content
            ) : status === "complete" ? (
              <Outtro />
            ) : null}
          </m.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-4 z-[1] flex w-full items-center justify-between px-6">
        <div className={clsx("flex h-fit gap-4", step === 0 && "invisible")}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
            <Step key={i} step={i} currentStep={step} />
          ))}
        </div>
        <div className="flex gap-2">
          {step !== 0 && step <= totalSteps && (
            <Button
              onClick={() => {
                if (step > 0) {
                  setStep((prev) => prev - 1)
                  setDirection(-1)
                }
              }}
              variant={"outline"}
            >
              Back
            </Button>
          )}
          <Button
            onClick={(e) => {
              if (step <= totalSteps) {
                setStep((prev) => prev + 1)
                setDirection(1)
              } else {
                finishGuide()

                const target = e.target as HTMLElement
                const { x, y } = target.getBoundingClientRect()
                mountLottie(absoluteConfettiUrl, {
                  x: x - 40,
                  y: y - 80,

                  height: 120,
                  width: 120,
                  onComplete() {
                    onClose()
                  },
                })
              }
            }}
          >
            {step <= totalSteps ? "Next" : "Finish"}
          </Button>
        </div>
      </div>
    </m.div>
  )
}

function Step({ step, currentStep }: { step: number; currentStep: number }) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete"

  return (
    <m.div animate={status} className="relative">
      <m.div
        variants={{
          active: {
            scale: 1,
            transition: {
              delay: 0,
              duration: 0.2,
            },
          },
          complete: {
            scale: 1.25,
          },
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "tween",
          ease: "circOut",
        }}
        className="absolute inset-0 rounded-full bg-theme-accent/20"
      />

      <m.div
        initial={false}
        variants={{
          inactive: {
            backgroundColor: "var(--fo-background)",
            borderColor: "hsl(var(--border) / 0.5)",
            color: "hsl(var(--fo-foreground) / 0.2)",
          },
          active: {
            backgroundColor: "var(--fo-background)",
            borderColor: "hsl(var(--fo-a) / 1)",
            color: "hsl(var(--fo-a) / 1)",
          },
          complete: {
            backgroundColor: "hsl(var(--fo-a) / 1)",
            borderColor: "hsl(var(--fo-a) / 1)",
            color: "hsl(var(--fo-a) / 1)",
          },
        }}
        transition={{ duration: 0.2 }}
        className="relative flex size-7 items-center justify-center rounded-full border text-xs font-semibold"
      >
        <div className="flex items-center justify-center">
          {status === "complete" ? (
            <AnimatedCheckIcon className="size-4 text-white" />
          ) : (
            <span>{step}</span>
          )}
        </div>
      </m.div>
    </m.div>
  )
}

function AnimatedCheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <m.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeWidth={2}
        d="M3.514 11.83a22.927 22.927 0 0 1 5.657 5.656c2.75-5.025 6.289-8.563 11.314-11.314"
      />
    </svg>
  )
}
