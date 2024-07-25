import { app } from "electron"

export const setDockCount = (
  input: number,
) => {
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
