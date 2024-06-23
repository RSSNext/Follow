import path from "node:path"

import { is } from "@electron-toolkit/utils"
import { callGlobalContextMethod } from "@shared/bridge"
import type { BrowserWindowConstructorOptions } from "electron"
import { BrowserWindow, shell } from "electron"

import icon from "../../resources/icon.png?asset"
import { store } from "./store"

const windows = {
  settingWindow: null as BrowserWindow | null,
  mainWindow: null as BrowserWindow | null,
}

export function createWindow(
  options: {
    extraPath?: string
    height: number
    width: number
  } & BrowserWindowConstructorOptions,
) {
  const { extraPath, height, width, ...configs } = options
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    show: false,
    resizable: configs?.resizable ?? true,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.mjs"),
      sandbox: false,
    },

    titleBarStyle: "hiddenInset",
    trafficLightPosition: {
      x: 18,
      y: 18,
    },

    transparent: true,
    backgroundColor: "#00000000", // transparent hexadecimal or anything with transparency,
    vibrancy: "sidebar",
    visualEffectState: "active",
    ...configs,
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
      const trueUrl =
        process.env["VITE_IMGPROXY_URL"] &&
        details.url.startsWith(process.env["VITE_IMGPROXY_URL"]) ?
          decodeURIComponent(
            details.url.replace(
              new RegExp(
                  `^${process.env["VITE_IMGPROXY_URL"]}/unsafe/\\d+x\\d+/`,
              ),
              "",
            ),
          ) :
          details.url
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

export const createMainWindow = () => {
  const storeKey = "windowState"
  const windowState = store.get(storeKey) as {
    height: number
    width: number
    x: number
    y: number
  } | null

  const window = createWindow({
    width: windowState?.width || 1200,
    height: windowState?.height || 900,
    x: windowState?.x,
    y: windowState?.y,
    minWidth: 1024,
    minHeight: 500,
  })

  window.on("close", () => {
    const bounds = window.getBounds()
    store.set(storeKey, {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
    })
    windows.mainWindow = null
  })

  windows.mainWindow = window
  return window
}

export const createSettingWindow = () => {
  // We need to open the setting modal in the main window when the main window exists,
  // if we open a new window then the state between the two windows will be out of sync.
  if (windows.mainWindow) {
    windows.mainWindow.show()
    callGlobalContextMethod(windows.mainWindow, "showSetting")
    return
  }
  if (windows.settingWindow) {
    windows.settingWindow.show()
    return
  }
  const window = createWindow({
    extraPath: "/#settings",
    width: 700,
    height: 600,
    resizable: false,
  })

  windows.settingWindow = window
  window.on("closed", () => {
    windows.settingWindow = null
  })
}
