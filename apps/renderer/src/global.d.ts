import type { useTranslation } from "react-i18next"
// eslint-disable-next-line react-hooks/rules-of-hooks, unused-imports/no-unused-vars
const { t } = useTranslation()
// eslint-disable-next-line react-hooks/rules-of-hooks, unused-imports/no-unused-vars
const { t: settingsT } = useTranslation("settings")
// eslint-disable-next-line react-hooks/rules-of-hooks, unused-imports/no-unused-vars
const { t: shortcutsT } = useTranslation("shortcuts")
declare global {
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

  export type I18nKeys = OmitStringType<Parameters<typeof t>[0]>
  export type I18nKeysForSettings = OmitStringType<Parameters<typeof settingsT>[0]>
  export type I18nKeysForShortcuts = OmitStringType<Parameters<typeof shortcutsT>[0]>
}

export {}
