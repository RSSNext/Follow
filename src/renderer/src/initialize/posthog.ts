import { env } from "@env"
import { getMe } from "@renderer/atoms/user"
import type { CaptureOptions, Properties } from "posthog-js"

declare global {
  interface Window {
    posthog?: typeof import("posthog-js").default
  }
}
export const initPostHog = async () => {
  if (import.meta.env.DEV) return
  const { default: posthog } = await import("posthog-js")

  if (env.VITE_POSTHOG_KEY === undefined) return
  posthog.init(env.VITE_POSTHOG_KEY, {
    person_profiles: "identified_only",
  })

  const { capture } = posthog
  // @ts-expect-error
  window.posthog = {
    ...posthog,
    capture(
      event_name: string,
      properties?: Properties | null,
      options?: CaptureOptions,
    ) {
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

  const user = getMe()
  if (user) {
    posthog.identify(user.id, { name: user.name, handle: user.handle })
  }
}
