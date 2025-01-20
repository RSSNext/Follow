import type { ElectronAPI } from "@electron-toolkit/preload"

import { env, isDev } from "./env"

declare const globalThis: {
  window: Window & {
    electron?: ElectronAPI
    api?: { canWindowBlur: boolean }
  }
  electron?: ElectronAPI
}

export const APP_PROTOCOL = isDev ? "follow-dev" : "follow"
export const DEEPLINK_SCHEME = `${APP_PROTOCOL}://` as const

export const WEB_URL = env.VITE_WEB_URL

export const SYSTEM_CAN_UNDER_BLUR_WINDOW = globalThis?.window?.electron
  ? globalThis?.window.api?.canWindowBlur
  : false

export const IN_ELECTRON = !!globalThis["electron"]

declare const ELECTRON: boolean
/**
 * Current build type for electron
 */
export const ELECTRON_BUILD = !!ELECTRON
