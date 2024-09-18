import { appRoute } from "./app"
import { debugRoute } from "./debug"
import { dockRoute } from "./dock"
import { menuRoute } from "./menu"
import { readerRoute } from "./reader"
import { settingRoute } from "./setting"
import { trackerRoute } from "./tracker"

export const router = {
  ...debugRoute,
  ...menuRoute,
  ...settingRoute,
  ...appRoute,
  ...trackerRoute,
  ...dockRoute,
  ...readerRoute,
}

export type Router = typeof router
