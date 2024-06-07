import type { ReactEventHandler } from "react"

export const stopPropagation: ReactEventHandler<any> = (e) =>
  e.stopPropagation()

export const preventDefault: ReactEventHandler<any> = (e) => e.preventDefault()
