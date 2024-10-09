import { m, useAnimationControls } from "framer-motion"
import type { FC, PropsWithChildren } from "react"
import { useEffect, useState } from "react"

import { nextFrame, stopPropagation } from "~/lib/dom"
import { cn } from "~/lib/utils"

import { ModalClose } from "./components"
import { useCurrentModal } from "./hooks"

export const PlainModal = ({ children }: PropsWithChildren) => children

export { PlainModal as NoopChildren }

type ModalTemplateType = {
  (props: PropsWithChildren<{ className?: string }>): JSX.Element
  class: (className: string) => (props: PropsWithChildren<{ className?: string }>) => JSX.Element
}

export const SlideUpModal: ModalTemplateType = (props) => {
  const winHeight = useState(() => window.innerHeight)[0]
  const { dismiss } = useCurrentModal()
  return (
    <div className={"container center h-full"} onPointerDown={dismiss} onClick={stopPropagation}>
      <m.div
        onPointerDown={stopPropagation}
        tabIndex={-1}
        initial={{
          y: "100%",
          opacity: 0.9,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: winHeight,
        }}
        transition={{
          type: "spring",
          mass: 0.4,
          tension: 100,
          friction: 1,
        }}
        className={cn(
          "relative flex flex-col items-center overflow-hidden rounded-xl border bg-theme-background p-8 pb-0",
          "aspect-[7/9] w-[600px] max-w-full shadow lg:max-h-[calc(100vh-10rem)]",
          props.className,
        )}
      >
        {props.children}

        <ModalClose />
      </m.div>
    </div>
  )
}

SlideUpModal.class = (className: string) => {
  return (props: ComponentType) => (
    <SlideUpModal {...props} className={cn(props.className, className)} />
  )
}

const modalVariant = {
  enter: {
    x: 0,
    opacity: 1,
  },
  initial: {
    x: 700,
    opacity: 0.9,
  },
  exit: {
    x: 750,
    opacity: 0,
  },
}
export const DrawerModalLayout: FC<PropsWithChildren> = ({ children }) => {
  const { dismiss } = useCurrentModal()
  const controller = useAnimationControls()
  useEffect(() => {
    nextFrame(() => controller.start("enter"))
  }, [controller])

  return (
    <div className={"h-full"} onPointerDown={dismiss} onClick={stopPropagation}>
      <m.div
        onPointerDown={stopPropagation}
        tabIndex={-1}
        initial="initial"
        animate={controller}
        variants={modalVariant}
        transition={{
          type: "spring",
          mass: 0.4,
          tension: 100,
          friction: 1,
        }}
        exit="exit"
        layout="size"
        className={cn(
          "flex flex-col items-center overflow-hidden rounded-xl border bg-theme-background p-8 pb-0",
          "shadow-drawer-to-left w-[60ch] max-w-full",
          "fixed inset-y-2 right-2",
        )}
      >
        {children}
      </m.div>
    </div>
  )
}
