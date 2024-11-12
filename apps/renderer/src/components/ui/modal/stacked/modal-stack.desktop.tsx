import { AnimatePresence } from "framer-motion"
import { useAtomValue } from "jotai"
import { useEffect } from "react"

import { ModalInternal } from "."
import { modalStackAtom } from "./atom"
import { useModalStack } from "./hooks"

export const ModalStack = () => {
  const { present } = useModalStack()
  window.presentModal = present

  const stack = useAtomValue(modalStackAtom)

  const topModalIndex = stack.findLastIndex((item) => item.modal)
  const overlayIndex = stack.findLastIndex((item) => item.overlay || item.modal)
  const overlayOptions = stack[overlayIndex]?.overlayOptions

  const hasModalStack = stack.length > 0
  const topModalIsNotSetAsAModal = topModalIndex !== stack.length - 1

  useEffect(() => {
    // NOTE: document.body is being used by radix's dismissable,
    // and using that will cause radix to get the value of `none` as the store value,
    // and then revert to `none` instead of `auto` after a modal dismiss.
    document.documentElement.style.pointerEvents =
      hasModalStack && !topModalIsNotSetAsAModal ? "none" : "auto"
    document.documentElement.dataset.hasModal = hasModalStack.toString()
  }, [hasModalStack, topModalIsNotSetAsAModal])
  return (
    <AnimatePresence mode="popLayout">
      {stack.map((item, index) => (
        <ModalInternal
          key={item.id}
          item={item}
          index={index}
          isTop={index === topModalIndex}
          isBottom={index === 0}
          overlayOptions={overlayOptions}
        />
      ))}
    </AnimatePresence>
  )
}
