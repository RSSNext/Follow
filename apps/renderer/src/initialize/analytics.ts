import { env } from "@follow/shared/env"
import type { TrackProperties } from "@openpanel/web"

import { getGeneralSettings } from "~/atoms/settings/general"

import { op } from "./op"

declare global {
  interface Window {
    analytics?: {
      capture: (event_name: string, properties?: TrackProperties | null) => void
      reset: () => void
    }
  }
}
export const initAnalytics = () => {
  if (env.VITE_OPENPANEL_CLIENT_ID === undefined) return

  op.setGlobalProperties({
    build: ELECTRON ? "electron" : "web",
    version: APP_VERSION,
    hash: GIT_COMMIT_SHA,
  })

  window.analytics = {
    reset: () => {
      // op.clear()
    },
    capture(event_name: string, properties?: TrackProperties | null) {
      if (import.meta.env.DEV) return
      if (!getGeneralSettings().sendAnonymousData) {
        return
      }

      op.track(event_name, properties as TrackProperties)
    },
  }
}
