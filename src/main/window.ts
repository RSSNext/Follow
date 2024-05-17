import { app, shell, BrowserWindow, Menu } from "electron"
import path from "path"
import { is } from "@electron-toolkit/utils"
import icon from "../../resources/icon.png?asset"

let mainWindow: BrowserWindow
function handleOpen(url: string) {
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
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
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
      let trueUrl
      if (
        process.env["VITE_IMGPROXY_URL"] &&
        details.url.startsWith(process.env["VITE_IMGPROXY_URL"])
      ) {
        trueUrl = decodeURIComponent(
          details.url.replace(
            new RegExp(
              `^${process.env["VITE_IMGPROXY_URL"]}/unsafe/\\d+x\\d+\/`,
            ),
            "",
          ),
        )
      } else {
        trueUrl = details.url
      }
      const refererMatch = refererMatchs.find((item) => item.url.test(trueUrl))
      callback({
        requestHeaders: {
          ...details.requestHeaders,
          Referer: refererMatch?.referer || trueUrl,
        },
      })
    },
  )

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        role: "appMenu",
        submenu: [
          { role: "about" },
          { type: "separator" },
          {
            label: "Settings...",
            accelerator: "CmdOrCtrl+,",
            click: () => {
              console.log("Oh, hi there!")
            },
          },
          { type: "separator" },
          { role: "hide" },
          { role: "quit" },
        ],
      },
      { role: "viewMenu" },
      { role: "windowMenu" },
    ]),
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
