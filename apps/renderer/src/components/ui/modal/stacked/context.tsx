import type { FC, RefObject } from "react"
import { createContext as reactCreateContext } from "react"
import { createContext as createContextSelector } from "use-context-selector"

export type CurrentModalContentProps = ModalActionsInternal & {
  ref: RefObject<HTMLElement | null>
}

const warnNoProvider = () => {
  if (import.meta.env.DEV) {
    console.error(
      "No ModalProvider found, please make sure to wrap your component with ModalProvider",
    )
  }
}
const defaultCtxValue: CurrentModalContentProps = {
  dismiss: warnNoProvider,
  setClickOutSideToDismiss: warnNoProvider,
  ref: { current: null },
  getIndex: () => 0,
}

export const CurrentModalContext = reactCreateContext<CurrentModalContentProps>(defaultCtxValue)
export const CurrentModalStateContext = createContextSelector<{
  isTop: boolean
}>({
  isTop: true,
})

export type ModalContentComponent<T = object> = FC<ModalActionsInternal & T>
export type ModalActionsInternal = {
  dismiss: () => void
  setClickOutSideToDismiss: (value: boolean) => void
  getIndex: () => number
}
