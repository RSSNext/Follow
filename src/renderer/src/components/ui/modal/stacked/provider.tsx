import { AnimatePresence } from "framer-motion"
import { useAtomValue } from "jotai"
import type { FC, PropsWithChildren } from "react"

import { modalStackAtom } from "./context"
import { useDismissAllWhenRouterChange } from "./hooks"
import { ModalInternal } from "./modal"

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
    </AnimatePresence>
  )
}
