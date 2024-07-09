import path from "node:path"

import { registerIpcMain } from "@egoist/tipc/main"
import * as Sentry from "@sentry/electron/main"
import { app } from "electron"

import { getIconPath } from "./helper"
import { registerAppMenu } from "./menu"
import { router } from "./tipc"

const appFolder = {
  prod: "Follow",
  dev: "Follow (dev)",
}

const isDev = process.env.NODE_ENV === "development"
export const initializationApp = () => {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
  })

  registerIpcMain(router)

  app.setPath(
    "appData",
    path.join(app.getPath("appData"), isDev ? appFolder.dev : appFolder.prod),
  )

  if (app.dock) {
    app.dock.setIcon(getIconPath())
  }

  // In this file you can include the rest of your app"s specific main process
  // code. You can also put them in separate files and require them here.
  registerAppMenu()
}
