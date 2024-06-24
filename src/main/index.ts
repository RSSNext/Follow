import "dotenv/config"

import path from "node:path"

import { registerIpcMain } from "@egoist/tipc/main"
import { electronApp, optimizer } from "@electron-toolkit/utils"
import { extractElectronWindowOptions } from "@shared/electron"
import { app, BrowserWindow, session } from "electron"

import { registerAppMenu } from "./menu"
import { router } from "./tipc"
import { createMainWindow, createWindow } from "./window"

let mainWindow: BrowserWindow
export const getMainWindow = () => mainWindow
registerIpcMain(router)

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("follow", process.execPath, [
      path.resolve(process.argv[1]),
    ])
  }
} else {
  app.setAsDefaultProtocolClient("follow")
}

if (app.dock) {
  app.dock.setIcon(path.join(__dirname, "../../resources/icon.png"))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("re.follow")

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  mainWindow = createMainWindow()

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow()
    }
  })

  const handleOpen = (url: string) => {
    const urlObj = new URL(url)
    if (urlObj.hostname === "auth") {
      const token = urlObj.searchParams.get("token")
      if (token && process.env["VITE_API_URL"]) {
        mainWindow.webContents.session.cookies.set({
          url: process.env["VITE_API_URL"],
          name: "authjs.session-token",
          value: token,
          secure: true,
          httpOnly: true,
          domain: new URL(process.env["VITE_API_URL"]).hostname,
          sameSite: "no_restriction",
        })
        mainWindow.reload()
      }
    } else {
      const options = extractElectronWindowOptions(url)

      const { height, resizable, width } = options || {}
      createWindow({
        extraPath: url.replace("follow:/", ""),
        width: width ?? 800,
        height: height ?? 600,
        resizable,
      })
    }
  }

  app.on("second-instance", (_, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    const url = commandLine.pop()
    if (url) {
      handleOpen(url)
    }
  })
  app.on("open-url", (_, url) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    handleOpen(url)
  })

  // for dev debug

  if (process.env.NODE_ENV === "development") {
    import("electron-devtools-installer").then(
      ({ default: installExtension, REACT_DEVELOPER_TOOLS }) => {
        installExtension(REACT_DEVELOPER_TOOLS, {
          loadExtensionOptions: { allowFileAccess: true },
        })
          .then((name) => console.info(`Added Extension:  ${name}`))
          .catch((err) => console.info("An error occurred:", err))

        session.defaultSession.getAllExtensions().forEach((e) => {
          session.defaultSession.loadExtension(e.path)
        })
      },
    )
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
registerAppMenu()
