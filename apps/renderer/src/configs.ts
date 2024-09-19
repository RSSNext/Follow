import { env } from "@follow/shared/env"
import type { BrowserOptions } from "@sentry/react"
import { FetchError } from "ofetch"

import { CustomSafeError } from "./components/errors/helper"

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

    if (
      error instanceof Error &&
      (/Network Error/i.test(error.message) ||
        /Fetch Error/i.test(error.message) ||
        /XHR Error/i.test(error.message) ||
        /adsbygoogle/i.test(error.message) ||
        /Failed to fetch/i.test(error.message) ||
        error.message.includes("fetch failed") ||
        error.message.includes("Unable to open cursor") ||
        error.message.includes("Document is not focused."))
    ) {
      return null
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
