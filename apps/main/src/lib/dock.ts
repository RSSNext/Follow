import { app } from "electron"

import { isWindows } from "../env"

export const setDockCount = (input: number) => {
  // TODO use Electron Overlay API
  if (isWindows) return
  if (app.dock) {
    if (input === 0) {
      app.dock.setBadge("")
    } else {
      app.dock.setBadge(input.toString())
    }
  } else {
    app.setBadgeCount(input)
  }
}
