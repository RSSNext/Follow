import type { FC, PropsWithChildren } from "react"
import type { useTranslation } from "react-i18next"
// eslint-disable-next-line react-hooks/rules-of-hooks, unused-imports/no-unused-vars
const { t } = useTranslation()
// eslint-disable-next-line react-hooks/rules-of-hooks, unused-imports/no-unused-vars
const { t: settingsT } = useTranslation("settings")
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

  /**
   * This function is a macro, will replace in the build stage.
   */
  export function tw(strings: TemplateStringsArray, ...values: any[]): string

  export type I18nKeys = OmitStringType<Parameters<typeof t>[0]>
  export type I18nKeysForSettings = OmitStringType<Parameters<typeof settingsT>[0]>

  type IsLiteralString<T> = T extends string ? (string extends T ? never : T) : never

  type OmitStringType<T> = T extends any[] ? OmitStringType<T[number]> : IsLiteralString<T>
}

export {}
