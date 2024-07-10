import { version } from "@pkg"
import { useEffect } from "react"
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from "react-router-dom"

import { SentryConfig } from "../configs"

export const initSentry = async () => {
  if (!window.SENTRY_RELEASE) return
  const [Sentry, posthog] = await Promise.all([
    import("@sentry/react"),
    import("posthog-js").then((module) => module.default),
  ])
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_BUILD_TYPE ?? "development",
    integrations: [
      Sentry.moduleMetadataIntegration(),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      posthog.sentryIntegration({
        organization: "follow-rg",
        // eslint-disable-next-line unicorn/numeric-separators-style
        projectId: 4507570439979008,
        severityAllowList: ["error", "info"], // optional: here is set to handle captureMessage (info) and captureException (error)
      },
      ),
    ],
    ...SentryConfig,
  })

  Sentry.setTags({
    appVersion: version,
  })
}
