import { AnimatePresence } from "framer-motion"
import { useAtomValue } from "jotai"
import type { FC, PropsWithChildren } from "react"

import { modalStackAtom } from "./atom"
import { ModalInternal } from "./modal"

export const ModalStackProvider: FC<PropsWithChildren> = ({ children }) => (
  <>
    {children}
    <ModalStack />
  </>
)

const ModalStack = () => {
  const stack = useAtomValue(modalStackAtom)

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
          overlayOptions={overlayOptions}
        />
      ))}
    </AnimatePresence>
  )
}
