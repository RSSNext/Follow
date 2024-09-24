import type { PropsWithChildren } from "react"
import { useState } from "react"

import { m } from "~/components/common/Motion"
import { stopPropagation } from "~/lib/dom"
import { cn } from "~/lib/utils"

import { ModalClose } from "./components"
import { useCurrentModal } from "./hooks"

export const PlainModal = ({ children }: PropsWithChildren) => children

export { PlainModal as NoopChildren }

export const SlideUpModal = (props: PropsWithChildren) => {
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
          "h-[80vh] w-[600px] max-w-full shadow lg:max-h-[calc(100vh-10rem)]",
        )}
      >
        {props.children}

        <ModalClose />
      </m.div>
    </div>
  )
}
