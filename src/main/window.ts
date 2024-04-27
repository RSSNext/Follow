import { app, shell, BrowserWindow } from "electron"
import path from "path"
import { is } from "@electron-toolkit/utils"
import icon from "../../resources/icon.png?asset"

let mainWindow: BrowserWindow
function handleOpen(url: string) {
  const urlObj = new URL(url)
  if (urlObj.hostname === "auth") {
    const token = urlObj.searchParams.get("token")
    if (token && process.env["VITE_ELECTRON_REMOTE_URL"]) {
      mainWindow.webContents.session.cookies.set({
        url: process.env["VITE_ELECTRON_REMOTE_URL"],
        name: "__Secure-authjs.session-token",
        value: token,
      })
      mainWindow.reload()
    }
  }
}

export function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
    titleBarStyle: "hiddenInset",
  })

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["VITE_ELECTRON_REMOTE_URL"]) {
    mainWindow.loadURL(process.env["VITE_ELECTRON_REMOTE_URL"])
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"))
  }

  const refererMatchs = [
    {
      url: /^https:\/\/\w+\.sinaimg.cn/,
      referer: "https://weibo.com",
    },
    {
      url: /^https:\/\/i\.pximg\.net/,
      referer: "https://www.pixiv.net",
    },
  ]
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const refererMatch = refererMatchs.find((item) =>
        item.url.test(details.url),
      )
      callback({
        requestHeaders: {
          ...details.requestHeaders,
          Referer: refererMatch?.referer || details.url,
        },
      })
    },
  )

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
}
