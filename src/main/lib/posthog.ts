import { env } from "@env"
import Posthog from "posthog-js"

export const initPosthog = () => {
  if (env.VITE_POSTHOG_KEY === undefined) return
  Posthog.init(env.VITE_POSTHOG_KEY, {
    person_profiles: "identified_only",
    debug: true,
  })
  return Posthog
}
export const posthog = initPosthog()

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  posthog?.capture(event, properties)
}
