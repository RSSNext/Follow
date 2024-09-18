import type { FC, PropsWithChildren } from "react"
import { createPortal } from "react-dom"

import { useRootPortal } from "./provider"

export const RootPortal: FC<
  {
    to?: HTMLElement
  } & PropsWithChildren
> = (props) => {
  const to = useRootPortal()

  return createPortal(props.children, props.to || to || document.body)
}
