import { app } from "electron"

import { isWindows } from "../env"

export const setDockCount = (input: number) => {
  // TODO use Electron Overlay API
  if (isWindows) return
  if (app.dock) {
    app.dock.setBadge(input === 0 ? "" : input < 100 ? input.toString() : "99+")
  } else {
    app.setBadgeCount(input)
  }
}
