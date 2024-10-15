import { env } from "@follow/shared/env"
import { version } from "@pkg"
import { useEffect } from "react"
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom"

import { whoami } from "~/atoms/user"

import { SentryConfig } from "../configs"

export const initSentry = async () => {
  if (!window.SENTRY_RELEASE) return
  if (import.meta.env.DEV) return
  const Sentry = await import("@sentry/react")
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: RELEASE_CHANNEL,
    integrations: [
      Sentry.moduleMetadataIntegration(),
      Sentry.httpClientIntegration(),
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
