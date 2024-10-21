import path from "node:path"
import { fileURLToPath } from "node:url"

import { is } from "@electron-toolkit/utils"
import { callWindowExpose } from "@follow/shared/bridge"
import { IMAGE_PROXY_URL, imageRefererMatches } from "@follow/shared/image"
import type { BrowserWindowConstructorOptions } from "electron"
import { BrowserWindow, screen, shell } from "electron"

import { isDev, isMacOS, isWindows, isWindows11 } from "./env"
import { getIconPath } from "./helper"
import { store } from "./lib/store"
import { logger } from "./logger"
import { cancelPollingUpdateUnreadCount, pollingUpdateUnreadCount } from "./tipc/dock"

const windows = {
  settingWindow: null as BrowserWindow | null,
  mainWindow: null as BrowserWindow | null,
}
globalThis["windows"] = windows
const { platform } = process
const __dirname = fileURLToPath(new URL(".", import.meta.url))
export function createWindow(
  options: {
    extraPath?: string
    height: number
    width: number
  } & BrowserWindowConstructorOptions,
) {
  const { extraPath, height, width, ...configs } = options

  const baseWindowConfig: Electron.BrowserWindowConstructorOptions = {
    width,
    height,
    show: false,
    resizable: configs?.resizable ?? true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.mjs"),
      sandbox: false,
      webviewTag: true,
      webSecurity: !isDev,
    },
  }

  switch (platform) {
    case "darwin": {
      Object.assign(baseWindowConfig, {
        titleBarStyle: "hiddenInset",
        trafficLightPosition: {
          x: 18,
          y: 18,
        },
        vibrancy: "under-window",
        visualEffectState: "active",
        transparent: true,
      } as Electron.BrowserWindowConstructorOptions)
      break
    }

    case "win32": {
      Object.assign(baseWindowConfig, {
        icon: getIconPath(),

        titleBarStyle: "hidden",
        // Electron material bug, comment this for now
        // backgroundMaterial: isWindows11 ? "mica" : undefined,

        frame: true,
      } as Electron.BrowserWindowConstructorOptions)
      break
    }

    default: {
      baseWindowConfig.icon = getIconPath()
    }
  }

  // Create the browser window.
  const window = new BrowserWindow({
    ...baseWindowConfig,
    ...configs,
  })

  window.on("leave-html-full-screen", () => {
    function refreshBound(timeout = 0) {
      setTimeout(() => {
        // FIXME: workaround for theme bug in full screen mode
        const size = window?.getSize()
        window?.setSize(size[0] + 1, size[1] + 1)
        window?.setSize(size[0], size[1])
      }, timeout)
    }
    // To solve the vibrancy losing issue when leaving full screen mode
    // @see https://github.com/toeverything/AFFiNE/blob/280e24934a27557529479a70ab38c4f5fc65cb00/packages/frontend/electron/src/main/windows-manager/main-window.ts:L157
    refreshBound()
    refreshBound(1000)
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
    window.loadURL(process.env["ELECTRON_RENDERER_URL"] + (options?.extraPath || ""))

    logger.log(process.env["ELECTRON_RENDERER_URL"] + (options?.extraPath || ""))
  } else {
    const openPath = path.resolve(__dirname, "../renderer/index.html")
    window.loadFile(openPath, {
      hash: options?.extraPath,
    })
    logger.log(openPath, {
      hash: options?.extraPath,
    })
  }

  window.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    const trueUrl = details.url.startsWith(IMAGE_PROXY_URL)
      ? new URL(details.url).searchParams.get("url") || details.url
      : details.url
    const refererMatch = imageRefererMatches.find((item) => item.url.test(trueUrl))
    callback({
      requestHeaders: {
        ...details.requestHeaders,
        Referer: refererMatch?.referer || trueUrl,
      },
    })
  })

  if (isWindows) {
    // Change the default font-family and font-size of the devtools.
    // Make it consistent with Chrome on Windows, instead of SimSun.
    // ref: [[Feature Request]: Add possibility to change DevTools font · Issue #42055 · electron/electron](https://github.com/electron/electron/issues/42055)
    window.webContents.on("devtools-opened", () => {
      // source-code-font: For code such as Elements panel
      // monospace-font: For sidebar such as Event Listener Panel
      const css = `
        :root {
            --source-code-font-family: consolas;
            --source-code-font-size: 13px;
            --monospace-font-family: consolas;
            --monospace-font-size: 13px;
        }`
      window.webContents.devToolsWebContents?.executeJavaScript(`
        const overriddenStyle = document.createElement('style');
        overriddenStyle.innerHTML = '${css.replaceAll("\n", " ")}';
        document.body.append(overriddenStyle);
        document.body.classList.remove('platform-windows');
      `)
    })
  }

  return window
}
export const windowStateStoreKey = "windowState"
export const createMainWindow = () => {
  const windowState = store.get(windowStateStoreKey) as {
    height: number
    width: number
    x: number
    y: number
  } | null
  const primaryDisplay = screen.getPrimaryDisplay()
  const { workArea } = primaryDisplay

  const maxWidth = workArea.width
  const maxHeight = workArea.height

  const width = Math.min(windowState?.width || 1200, maxWidth)
  const height = Math.min(windowState?.height || 900, maxHeight)

  const ensureInBounds = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(value, max))
  }

  const x =
    windowState?.x !== undefined
      ? ensureInBounds(windowState.x, workArea.x, workArea.x + workArea.width - width)
      : undefined

  const y =
    windowState?.y !== undefined
      ? ensureInBounds(windowState.y, workArea.y, workArea.y + workArea.height - height)
      : undefined

  const window = createWindow({
    width: windowState?.width || 1200,
    height: windowState?.height || 900,
    x,
    y,
    minWidth: Math.min(1024, maxWidth),
    minHeight: Math.min(500, maxHeight),
  })

  window.on("close", () => {
    if (isWindows11) {
      const windowStoreKey = Symbol.for("maximized")
      if (window[windowStoreKey]) {
        const stored = window[windowStoreKey]
        store.set(windowStateStoreKey, {
          width: stored.size[0],
          height: stored.size[1],
          x: stored.position[0],
          y: stored.position[1],
        })

        return
      }
    }

    const bounds = window.getBounds()
    store.set(windowStateStoreKey, {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
    })
  })

  windows.mainWindow = window

  window.on("close", (event) => {
    if (isMacOS) {
      event.preventDefault()
      if (window.isFullScreen()) {
        window.once("leave-full-screen", () => {
          window.hide()
        })
        window.setFullScreen(false)
      } else {
        window.hide()
      }

      const caller = callWindowExpose(window)
      caller.onWindowClose()
    } else {
      windows.mainWindow = null
    }
  })

  window.on("show", () => {
    cancelPollingUpdateUnreadCount()

    const caller = callWindowExpose(window)

    caller.onWindowShow()
  })

  window.on("hide", async () => {
    const caller = callWindowExpose(window)
    const settings = await caller.getUISettings()

    if (settings.showDockBadge) {
      pollingUpdateUnreadCount()
    }
  })

  return window
}

export const createSettingWindow = (path?: string) => {
  // We need to open the setting modal in the main window when the main window exists,
  // if we open a new window then the state between the two windows will be out of sync.
  if (windows.mainWindow && windows.mainWindow.isVisible()) {
    windows.mainWindow.show()

    callWindowExpose(windows.mainWindow).showSetting(path)
    return
  }
  if (windows.settingWindow) {
    windows.settingWindow.show()
    return
  }
  const window = createWindow({
    extraPath: `#settings/${path || ""}`,
    width: 700,
    height: 600,
    resizable: false,
  })

  windows.settingWindow = window
  window.on("closed", () => {
    windows.settingWindow = null
  })
}

export const getMainWindow = () => windows.mainWindow

export const getMainWindowOrCreate = () => {
  if (!windows.mainWindow) {
    createMainWindow()
  }
  return windows.mainWindow
}

export const destroyMainWindow = () => {
  windows.mainWindow?.destroy()
  windows.mainWindow = null
}
