import * as Sentry from "@sentry/electron/main"
import { FetchError } from "ofetch"

export const initializeSentry = () => {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.captureConsoleIntegration({
        levels: ["error"],
      }),
    ],

    beforeSend(event, hint) {
      const error = hint.originalException

      if (
        error instanceof Error &&
        (/Network Error/i.test(error.message) ||
          /Fetch Error/i.test(error.message) ||
          /XHR Error/i.test(error.message) ||
          /adsbygoogle/i.test(error.message) ||
          /Failed to fetch/i.test(error.message) ||
          error.message.includes("fetch failed"))
      ) {
        return null
      }

      if (error instanceof FetchError) {
        return null
      }

      return event
    },
  })
}
