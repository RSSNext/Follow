import { initI18n } from "@client/i18n"
import { env } from "@follow/shared/env"
import { authConfigManager } from "@hono/auth-js/react"

import { initAnalytics } from "./analytics"
import { initSentry } from "./sentry"

export const initialize = () => {
  authConfigManager.setConfig({
    baseUrl: env.VITE_API_URL,
    basePath: "/auth",
    credentials: "include",
  })

  initI18n()
  initAnalytics()
  initSentry()
}
