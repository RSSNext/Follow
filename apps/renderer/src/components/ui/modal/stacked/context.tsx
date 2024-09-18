import type { FC, RefObject } from "react"
import { createContext } from "react"

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
}

export const CurrentModalContext = createContext<CurrentModalContentProps>(defaultCtxValue)

export type ModalContentComponent<T = object> = FC<ModalActionsInternal & T>
export type ModalActionsInternal = {
  dismiss: () => void
  setClickOutSideToDismiss: (value: boolean) => void
}
