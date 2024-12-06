import { initI18n } from "@client/i18n"
import { initializeDayjs } from "@follow/components/dayjs"

import { initAnalytics } from "./analytics"
import { initSentry } from "./sentry"

export const initialize = () => {
  initializeDayjs()
  initI18n()
  initAnalytics()
  initSentry()
}
