import { Tooltip, TooltipContent, TooltipTrigger } from "@follow/components/ui/tooltip/index.js"
import type { PropsWithChildren } from "react"
import { createContext, useContext } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { m } from "~/components/common/Motion"

import { microReboundPreset } from "../../constants/spring"
import { FixedModalCloseButton } from "../components/close"
import { useCurrentModal, useModalStack } from "../stacked/hooks"

const InPeekModal = createContext(false)
export const useInPeekModal = () => useContext(InPeekModal)
export const PeekModal = (
  props: PropsWithChildren<{
    to?: string
  }>,
) => {
  const { dismissAll } = useModalStack()
  const { to, children } = props
  const { t } = useTranslation("common")
  const { dismiss } = useCurrentModal()

  return (
    <div className="relative mx-auto mt-[10vh] max-w-full overflow-auto px-2 scrollbar-none lg:max-w-[65rem] lg:p-0">
      <m.div
        initial={{ opacity: 0.5, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={microReboundPreset}
        className="scrollbar-none"
      >
        <InPeekModal.Provider value={true}>{children}</InPeekModal.Provider>
      </m.div>
      <m.div
        initial={true}
        exit={{
          opacity: 0,
        }}
        className="fixed right-4 flex items-center gap-4 safe-inset-top-4"
      >
        {!!to && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="center flex size-8 cursor-button rounded-full bg-theme-background p-1 shadow-sm ring-1 ring-zinc-200 dark:ring-neutral-800"
                to={to}
                onClick={dismissAll}
              >
                <i className="i-mgc-fullscreen-2-cute-re text-lg" />
                <span className="sr-only">Go to this link</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>{t("words.expand")}</TooltipContent>
          </Tooltip>
        )}
        <FixedModalCloseButton onClick={dismiss} />
      </m.div>
    </div>
  )
}
