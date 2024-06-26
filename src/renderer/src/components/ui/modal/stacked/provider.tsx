import { AnimatePresence } from "framer-motion"
import { useAtomValue } from "jotai"
import type { FC, PropsWithChildren } from "react"

import { modalStackAtom } from "./atom"
import { MODAL_STACK_Z_INDEX } from "./constants"
import { useDismissAllWhenRouterChange } from "./hooks"
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

  useDismissAllWhenRouterChange()

  return (
    <AnimatePresence mode="popLayout">
      {stack.map((item, index) => (
        <ModalInternal
          key={item.id}
          item={item}
          index={index}
          isTop={index === stack.length - 1}
        />
      ))}
      {stack.length > 0 && <ModalOverlay zIndex={MODAL_STACK_Z_INDEX + stack.length - 1} />}
    </AnimatePresence>
  )
}
