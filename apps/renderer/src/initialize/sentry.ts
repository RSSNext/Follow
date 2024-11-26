import { env } from "@follow/shared/env"
import { appSessionTraceId } from "@follow/utils/environment"
import { version } from "@pkg"
import { nanoid } from "nanoid"
import { useEffect } from "react"
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from "react-router"

import { whoami } from "~/atoms/user"
import { isElectronBuild } from "~/constants"

import { SentryConfig } from "./sentry.config"

Object.defineProperty(window.Error.prototype, "traceId", {
  get() {
    if (!this._traceId) {
      this._traceId = nanoid()
    }
    return this._traceId
  },
})
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

  Sentry.setTag("session_trace_id", appSessionTraceId)
  Sentry.setTag("app_version", version)
  Sentry.setTag("build", isElectronBuild ? "electron" : "web")
}
