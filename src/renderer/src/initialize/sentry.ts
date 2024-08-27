import { env } from "@env"
import { version } from "@pkg"
import { whoami } from "@renderer/atoms/user"
import { channel } from "@renderer/constants"
import { useEffect } from "react"
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom"

import { SentryConfig } from "../configs"

export const initSentry = async () => {
  if (!window.SENTRY_RELEASE) return
  if (import.meta.env.DEV) return
  const [Sentry, posthog] = await Promise.all([
    import("@sentry/react"),
    import("posthog-js").then((module) => module.default),
  ])
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: channel,
    integrations: [
      Sentry.moduleMetadataIntegration(),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.captureConsoleIntegration({
        levels: ["error"],
      }),
      posthog.sentryIntegration({
        organization: "follow-rg",

        projectId: 4507570439979008,
        severityAllowList: ["error", "info"], // optional: here is set to handle captureMessage (info) and captureException (error)
      }),
    ],
    ...SentryConfig,
  })

  const user = whoami()
  if (user) {
    Sentry.setTag("user_id", user.id)
    Sentry.setTag("user_name", user.name)
  }

  Sentry.setTag("appVersion", version)
}
