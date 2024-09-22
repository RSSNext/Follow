import { AnimatePresence } from "framer-motion"
import { useAtomValue } from "jotai"
import type { FC, PropsWithChildren } from "react"

import { useUISettingKey } from "~/atoms/settings/ui"

import { modalStackAtom } from "./atom"
import { MODAL_STACK_Z_INDEX } from "./constants"
import { ModalInternal } from "./modal"
import { ModalOverlay } from "./overlay"

export const ModalStackProvider: FC<PropsWithChildren> = ({ children }) => (
  <>
    {children}
    <ModalStack />
  </>
)

const ModalStack = () => {
  const stack = useAtomValue(modalStackAtom)

  const modalSettingOverlay = useUISettingKey("modalOverlay")

  const forceOverlay = stack.some((item) => item.overlay)
  const allForceHideOverlay = stack.every((item) => item.overlay === false)

  const topModalIndex = stack.findLastIndex((item) => item.modal)
  const overlayIndex = stack.findLastIndex((item) => item.overlay || item.modal)
  const overlayOptions = stack[overlayIndex]?.overlayOptions
  return (
    <AnimatePresence mode="popLayout">
      {stack.map((item, index) => (
        <ModalInternal
          key={item.id}
          item={item}
          index={index * 2}
          isTop={index === topModalIndex * 2}
        />
      ))}
      {stack.length > 0 && (modalSettingOverlay || forceOverlay) && !allForceHideOverlay && (
        <ModalOverlay
          zIndex={MODAL_STACK_Z_INDEX + overlayIndex * 2 - 2}
          blur={overlayOptions?.blur}
          className={overlayOptions?.className}
        />
      )}
    </AnimatePresence>
  )
}
