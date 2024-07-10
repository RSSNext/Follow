import "dotenv/config"

import path from "node:path"

import type { RendererHandlersCaller } from "@egoist/tipc/main"
import { getRendererHandlers } from "@egoist/tipc/main"
import { electronApp, optimizer } from "@electron-toolkit/utils"
import { APP_PROTOCOL, DEEPLINK_SCHEME } from "@shared/constants"
import { extractElectronWindowOptions } from "@shared/electron"
import { app, autoUpdater, BrowserWindow, session } from "electron"

import { initializationApp } from "./init"
import type { RendererHandlers } from "./tipc"
import { createMainWindow, createWindow } from "./window"

initializationApp()
let mainWindow: BrowserWindow
let handlers: RendererHandlersCaller<RendererHandlers>

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [
      path.resolve(process.argv[1]),
    ])
  }
} else {
  app.setAsDefaultProtocolClient(APP_PROTOCOL)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId(`re.${APP_PROTOCOL}`)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  mainWindow = createMainWindow()
  handlers = getRendererHandlers<RendererHandlers>(mainWindow.webContents)

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow()
      handlers = getRendererHandlers<RendererHandlers>(mainWindow.webContents)
    }
  })

  const handleOpen = (url: string) => {
    const urlObj = new URL(url)
    if (urlObj.hostname === "auth") {
      const token = urlObj.searchParams.get("token")
      const apiURL =
        process.env["VITE_API_URL"] || import.meta.env.VITE_API_URL
      if (token && apiURL) {
        mainWindow.webContents.session.cookies.set({
          url: apiURL,
          name: "authjs.session-token",
          value: token,
          secure: true,
          httpOnly: true,
          domain: new URL(apiURL).hostname,
          sameSite: "no_restriction",
        })
        mainWindow.reload()
      }
    } else {
      const options = extractElectronWindowOptions(url)

      const { height, resizable, width } = options || {}
      createWindow({
        extraPath: url.replace(DEEPLINK_SCHEME, "/"),
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
      ({ default: installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS }) => {
        [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS].forEach((extension) => {
          installExtension(extension, {
            loadExtensionOptions: { allowFileAccess: true },
          })
            .then((name) => console.info(`Added Extension:  ${name}`))
            .catch((err) => console.info("An error occurred:", err))
        })

        session.defaultSession.getAllExtensions().forEach((e) => {
          session.defaultSession.loadExtension(e.path)
        })
      },
    )
  }

  // Auto update
  autoUpdater.setFeedURL({
    url: `https://update.follow.is/update/${process.platform}/${app.getVersion()}`,
  })
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 15 * 60 * 1000)

  autoUpdater.on("update-downloaded", () => {
    handlers.updateDownloaded.send()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
