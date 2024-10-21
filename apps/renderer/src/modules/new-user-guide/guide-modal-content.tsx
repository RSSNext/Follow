import clsx from "clsx"
import { AnimatePresence, m } from "framer-motion"
import type { ComponentProps, FunctionComponentElement } from "react"
import { createElement, useCallback, useMemo, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import RSSHubIcon from "~/assets/rsshub-icon.png"
import { Logo } from "~/components/icons/logo"
import { Button } from "~/components/ui/button"
import { Kbd } from "~/components/ui/kbd/Kbd"
import { mountLottie } from "~/components/ui/lottie-container"
import { Markdown } from "~/components/ui/markdown/Markdown"
import { useI18n } from "~/hooks/common"
import confettiUrl from "~/lottie/confetti.lottie?url"
import { settings } from "~/queries/settings"

import { DiscoverImport } from "../discover/import"
import { settingSyncQueue } from "../settings/helper/sync-queue"
import { LanguageSelector } from "../settings/tabs/general"
import { useHaveUsedOtherRSSReader } from "./atoms"
import { BehaviorGuide } from "./steps/behavior"
import { TrendingFeeds } from "./steps/feeds"
import { Introduction } from "./steps/introduction"
import { RookieCheck } from "./steps/rookie"
import { RSSHubGuide } from "./steps/rsshub"

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
    <div className="w-[50ch] space-y-4 text-balance text-center">
      <Logo className="mx-auto size-20" />
      <p className="mt-5 text-xl font-semibold">{t("new_user_guide.intro.title")}</p>
      <p className="text-lg">{t("new_user_guide.intro.description")}</p>
      <LanguageSelector containerClassName="px-16" contentClassName="z-10" />
    </div>
  )
}

function Outtro() {
  const { t } = useTranslation("app")
  return (
    <div className="w-[50ch] space-y-4 text-balance text-center">
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
          icon: "i-mgc-grid-cute-re",
          title: "Features",
          content: createElement(Introduction, {
            features: [
              {
                icon: "i-mgc-magic-2-cute-re",
                title: t.settings("titles.actions"),
                description: t.app("new_user_guide.step.features.actions.description"),
              },
              {
                icon: "i-mgc-department-cute-re",
                title: t.settings("titles.integration"),
                description: t.app("new_user_guide.step.features.integration.description"),
              },
              {
                icon: "i-mgc-rada-cute-re",
                title: t.settings("titles.lists"),
                description: t.settings("lists.info"),
              },
              {
                icon: "i-mgc-hotkey-cute-re",
                title: t.settings("titles.shortcuts"),
                description: (
                  <p>
                    {t.app("new_user_guide.step.features.shortcuts.description1")}{" "}
                    <Trans
                      i18nKey="new_user_guide.step.features.shortcuts.description2"
                      components={{
                        kbd: <Kbd>H</Kbd>,
                      }}
                    />
                  </p>
                ),
              },
            ],
          }),
        },
        {
          title: "Power",
          icon: "i-mgc-power",
          content: (
            <Markdown className="max-w-xl">
              {t.app("new_user_guide.step.power.description")}
            </Markdown>
          ),
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
          title: t.app("new_user_guide.step.rsshub.title"),
          content: createElement(RSSHubGuide),
          icon: <img src={RSSHubIcon} className="size-[22px]" />,
        },
        haveUsedOtherRSSReader
          ? {
              title: t.app("new_user_guide.step.import.title"),
              content: createElement(DiscoverImport),
              icon: "i-mingcute-file-import-line",
            }
          : {
              title: t.app("new_user_guide.step.trending.title"),
              content: createElement(TrendingFeeds),
              icon: "i-mgc-trending-up-cute-re",
            },
      ].filter((i) => !!i) as {
        title: string
        icon: React.ReactNode
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

  const [isLottieAnimating, setIsLottieAnimating] = useState(false)

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
        <h1 className="absolute left-6 top-4 flex items-center gap-2 text-xl font-bold">
          {typeof guideSteps[step - 1].icon === "string" ? (
            <i className={clsx(guideSteps[step - 1].icon, "size-[22px]")} />
          ) : (
            guideSteps[step - 1].icon
          )}
          {title}
        </h1>
      )}

      <div className="relative mx-auto flex w-full max-w-3xl items-center">
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
            className="mt-20 px-6 pb-24"
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
        <div className={clsx("flex h-fit gap-3", step === 0 && "invisible")}>
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
            disabled={isLottieAnimating}
            onClick={(e) => {
              if (step <= totalSteps) {
                setStep((prev) => prev + 1)
                setDirection(1)
              } else {
                finishGuide()

                const target = e.target as HTMLElement
                const { x, y } = target.getBoundingClientRect()
                setIsLottieAnimating(true)
                mountLottie(absoluteConfettiUrl, {
                  x: x - 40,
                  y: y - 80,

                  height: 120,
                  width: 120,

                  speed: 2,

                  onComplete() {
                    setIsLottieAnimating(false)
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
