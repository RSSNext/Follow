import type { FC, RefObject } from "react"
import { createContext } from "react"

export type CurrentModalContentProps = ModalContentPropsInternal & {
  ref: RefObject<HTMLElement | null>
}

export const CurrentModalContext = createContext<CurrentModalContentProps>(
  null as any,
)

export type ModalContentComponent<T> = FC<ModalContentPropsInternal & T>
export type ModalContentPropsInternal = {
  dismiss: () => void
}
