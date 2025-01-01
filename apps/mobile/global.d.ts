import type { DOMProps } from "expo/dom"
import type { FC } from "react"

declare global {
  export type WebComponent<P = object> = FC<P & { dom?: DOMProps }>
}
export {}
