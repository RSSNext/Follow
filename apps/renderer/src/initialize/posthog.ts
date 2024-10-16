import { env } from "@follow/shared/env"
import type { CaptureOptions, Properties } from "posthog-js"
import { posthog } from "posthog-js"

import { getGeneralSettings } from "~/atoms/settings/general"
import { whoami } from "~/atoms/user"

declare global {
  interface Window {
    posthog?: {
      capture: InstanceType<typeof import("posthog-js").PostHog>["capture"]
      reset: InstanceType<typeof import("posthog-js").PostHog>["reset"]
    }
  }
}
export const initPostHog = () => {
  if (env.VITE_POSTHOG_KEY === undefined) return
  posthog.init(env.VITE_POSTHOG_KEY, {
    person_profiles: "identified_only",
    enable_heatmaps: false,
    autocapture: false,
    loaded: () => {
      const user = whoami()
      if (user) {
        posthog.identify(user.id, { name: user.name, handle: user.handle })
      }
    },
  })

  const { capture, reset } = posthog

  window.posthog = {
    reset,
    capture(event_name: string, properties?: Properties | null, options?: CaptureOptions) {
      if (import.meta.env.DEV) return
      if (!getGeneralSettings().sendAnonymousData) {
        return
      }
      return capture.apply(posthog, [
        event_name,
        {
          ...properties,
          build: ELECTRON ? "electron" : "web",
          version: APP_VERSION,
          hash: GIT_COMMIT_SHA,
        },
        options,
      ] as const)
    },
  }
}
