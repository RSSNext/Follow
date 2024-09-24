import "../../types/authjs"

import type { ElectronAPI } from "@electron-toolkit/preload"

declare global {
  interface Window {
    electron?: ElectronAPI
    api?: { canWindowBlur: boolean }
    platform: NodeJS.Platform
  }
}

declare module "react" {
  export interface AriaAttributes {
    "data-testid"?: string
  }
}

export {}
