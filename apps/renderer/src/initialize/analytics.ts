import { env } from "@follow/shared/env"
import type { TrackProperties } from "@openpanel/web"

import { getGeneralSettings } from "~/atoms/settings/general"

import { op } from "./op"
import { initPostHog } from "./posthog"

declare global {
  interface Window {
    analytics?: {
      capture: (event_name: string, properties?: TrackProperties | null) => void
      reset: () => void
    }
  }
}
export const initAnalytics = () => {
  // TODO remove this
  initPostHog()
  if (env.VITE_OPENPANEL_CLIENT_ID === undefined) return

  op.setGlobalProperties({
    build: ELECTRON ? "electron" : "web",
    version: APP_VERSION,
    hash: GIT_COMMIT_SHA,
  })

  window.analytics = {
    reset: () => {
      // op.clear()

      // TODO remove this if op ready
      window.posthog?.reset()
    },
    capture(event_name: string, properties?: TrackProperties | null) {
      if (import.meta.env.DEV) return
      if (!getGeneralSettings().sendAnonymousData) {
        return
      }
      // TODO remove this if op ready
      window.posthog?.capture(event_name, properties as TrackProperties)
      op.track(event_name, properties as TrackProperties)
    },
  }
}
