import { appRoute } from "./app"
import { debugRoute } from "./debug"
import { menuRoute } from "./menu"
import { settingRoute } from "./setting"
import { trackerRoute } from "./tracker"

export const router = {
  ...debugRoute,
  ...menuRoute,
  ...settingRoute,
  ...appRoute,
  ...trackerRoute,
}

export type Router = typeof router
