import type { FC, PropsWithChildren } from "react"

declare global {

  export type Component<P = object> = FC<ComponentType & P>

  export type ComponentType<P = object> = {
    className?: string
  } & PropsWithChildren &
  P
  export type Nullable<T> = T | null | undefined

}

export {}
