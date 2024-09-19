import type { User } from "@auth/core/types"

export const setIntegrationIdentify = (user: User) =>
  Promise.all([
    import("@sentry/react").then(({ setTag }) => {
      setTag("user_id", user.id)
      setTag("user_name", user.name)
    }),
    import("posthog-js").then(({ default: posthog }) => {
      posthog.identify(user.id, {
        name: user.name,
        handle: user.handle,
      })
    }),
  ])
