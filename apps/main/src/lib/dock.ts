import { app } from "electron"

import { isWindows } from "../env"

export const setDockCount = (input: number) => {
  // TODO use Electron Overlay API
  if (isWindows) return
  if (app.dock) {
    app.dock.setBadge(input === 0 ? "" : input < 10000 ? input.toString() : "9999+")
  } else {
    app.setBadgeCount(input)
  }
}
