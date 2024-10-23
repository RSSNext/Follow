import { initI18n } from "@client/i18n"

import { initAnalytics } from "./analytics"
import { initSentry } from "./sentry"

export const initialize = async () => {
  initI18n()
  initAnalytics()
  initSentry()
}
