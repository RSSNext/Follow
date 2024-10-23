import type { FC, PropsWithChildren } from "react"

declare global {
  export type Component<P = object> = FC<ComponentType & P>

  export type ComponentType<P = object> = {
    className?: string
  } & PropsWithChildren &
    P

  /**
   * This function is a macro, will replace in the build stage.
   */
  export function tw(strings: TemplateStringsArray, ...values: any[]): string
}

declare module "react" {
  export interface AriaAttributes {
    "data-testid"?: string
  }
}

export {}
