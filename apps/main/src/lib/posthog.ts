import { env } from "@follow/shared/env"
import { PostHog } from "posthog-node"

import { getUser } from "./user"

export const initPosthog = () => {
  if (env.VITE_POSTHOG_KEY === undefined) return

  return new PostHog(env.VITE_POSTHOG_KEY, {})
}
export const posthog = initPosthog()

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  const userId = getUser()?.id
  if (!userId) return
  posthog?.capture({ event, properties, distinctId: userId })
}
