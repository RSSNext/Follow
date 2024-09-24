import { env } from "@follow/shared/env"
import type { BrowserOptions } from "@sentry/react"
import { FetchError } from "ofetch"

import { CustomSafeError } from "./components/errors/helper"

const ERROR_PATTERNS = [
  /Network Error/i,
  /Fetch Error/i,
  /XHR Error/i,
  /adsbygoogle/i,
  /Failed to fetch/i,
  "fetch failed",
  "Unable to open cursor",
  "Document is not focused.",
  "HTTP Client Error",
]

export const SentryConfig: BrowserOptions = {
  // Performance Monitoring
  tracesSampleRate: 1, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", env.VITE_API_URL],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1,

  beforeSend(event, hint) {
    const error = hint.originalException

    if (error instanceof Error) {
      const isIgnoredError = ERROR_PATTERNS.some((pattern) =>
        pattern instanceof RegExp ? pattern.test(error.message) : error.message.includes(pattern),
      )

      if (isIgnoredError) {
        return null
      }
    }

    const isPassthroughError = [CustomSafeError, FetchError].some((errorType) => {
      if (error instanceof errorType) {
        return true
      }
      return false
    })
    const isAbortError = error instanceof Error && error.name === "AbortError"

    if (isPassthroughError || isAbortError) {
      return null
    }
    return event
  },
}
