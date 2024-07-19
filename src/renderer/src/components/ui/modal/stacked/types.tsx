import type { FC, PropsWithChildren, ReactNode } from "react"

import type { ModalActionsInternal } from "./context"

export interface ModalProps {
  title: ReactNode
  icon?: ReactNode

  CustomModalComponent?: FC<PropsWithChildren>
  content: FC<ModalActionsInternal>
  clickOutsideToDismiss?: boolean
  modalClassName?: string
  modalContainerClassName?: string

  max?: boolean

  wrapper?: FC

  overlay?: boolean
  draggable?: boolean
  canClose?: boolean
}
export interface ModalStackOptions {
  wrapper?: FC
}
