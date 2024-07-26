import { appRoute } from "./app"
import { debugRoute } from "./debug"
import { dockRoute } from "./dock"
import { menuRoute } from "./menu"
import { settingRoute } from "./setting"
import { trackerRoute } from "./tracker"

export const router = {
  ...debugRoute,
  ...menuRoute,
  ...settingRoute,
  ...appRoute,
  ...trackerRoute,
  ...dockRoute,
}

export type Router = typeof router
