import { shell, BrowserWindow } from "electron"
import path from "path"
import { is } from "@electron-toolkit/utils"
import icon from "../../resources/icon.png?asset"

export function createWindow(options?: {
  extraPath?: string
  width?: number
  height?: number
}) {
  // Create the browser window.
  const window = new BrowserWindow({
    width: options?.width || 1200,
    height: options?.height || 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
    titleBarStyle: "hiddenInset",
  })

  window.on("ready-to-show", () => {
    window?.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    window.loadURL(
      process.env["ELECTRON_RENDERER_URL"] + (options?.extraPath || ""),
    )
  } else {
    window.loadFile(path.join(__dirname, "../renderer/index.html"))
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
  window.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      let trueUrl
      if (
        process.env["VITE_IMGPROXY_URL"] &&
        details.url.startsWith(process.env["VITE_IMGPROXY_URL"])
      ) {
        trueUrl = decodeURIComponent(
          details.url.replace(
            new RegExp(
              `^${process.env["VITE_IMGPROXY_URL"]}/unsafe/\\d+x\\d+/`,
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

  return window
}
