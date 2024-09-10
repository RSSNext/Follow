import type { FC, PropsWithChildren } from "react"

declare global {
  export type Component<P = object> = FC<ComponentType & P>

  export type ComponentType<P = object> = {
    className?: string
  } & PropsWithChildren &
    P
  export type Nullable<T> = T | null | undefined

  // BIZ ID
  export type Id = string
  export type FeedId = Id
  export type EntryId = Id

  export const SENTRY_RELEASE: { id: string }
  export const APP_DEV_CWD: string
  export const GIT_COMMIT_SHA: string
  export const DEBUG: boolean
  export const ELECTRON: boolean
  export interface Window {
    SENTRY_RELEASE: typeof SENTRY_RELEASE
  }

  export const FEATURES: {
    WINDOW_UNDER_BLUR: boolean
  }

  export function tw(strings: TemplateStringsArray, ...values: any[]): string
}

export {}
