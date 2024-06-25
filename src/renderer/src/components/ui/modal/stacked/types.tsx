import type { FC, PropsWithChildren, ReactNode } from "react"

import type { ModalContentPropsInternal } from "./context"

export interface ModalProps {
  title: ReactNode
  icon?: ReactNode

  CustomModalComponent?: FC<PropsWithChildren>
  content: FC<ModalContentPropsInternal>
  clickOutsideToDismiss?: boolean
  modalClassName?: string
  modalContainerClassName?: string

  max?: boolean

  wrapper?: FC
}
export interface ModalStackOptions {
  wrapper?: FC
}
