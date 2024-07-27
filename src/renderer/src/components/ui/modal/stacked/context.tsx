import type { FC, RefObject } from "react"
import { createContext } from "react"

export type CurrentModalContentProps = ModalActionsInternal & {
  ref: RefObject<HTMLElement | null>
}

export const CurrentModalContext = createContext<CurrentModalContentProps>(
  null as any,
)

export type ModalContentComponent<T = object> = FC<ModalActionsInternal & T>
export type ModalActionsInternal = {
  dismiss: () => void
  setClickOutSideToDismiss: (value: boolean) => void
}
