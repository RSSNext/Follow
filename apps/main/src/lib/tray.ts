import { app, nativeImage, Tray } from "electron"

import { getIconPath } from "~/helper"

import { getMainWindow } from "../window"

export const registerAppTray = () => {
  const icon = nativeImage.createFromPath(getIconPath())
  // See https://stackoverflow.com/questions/41664208/electron-tray-icon-change-depending-on-dark-theme/41998326#41998326
  const trayIcon = icon.resize({ width: 16 })
  const tray = new Tray(trayIcon)

  tray.on("click", () => {
    const mainWindow = getMainWindow()
    if (mainWindow?.isMinimized()) {
      mainWindow.restore()
    } else {
      mainWindow?.show()
    }
  })
  tray.setToolTip(app.getName())
}
