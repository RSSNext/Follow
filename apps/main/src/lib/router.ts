import { callWindowExpose } from "@follow/shared/bridge"
import { DEEPLINK_SCHEME } from "@follow/shared/constants"
import { extractElectronWindowOptions } from "@follow/shared/electron"
import type { BrowserWindow } from "electron/main"

import { logger } from "~/logger"
import { createMainWindow, createWindow, getMainWindow } from "~/window"

export const handleUrlRouting = (url: string) => {
  const options = extractElectronWindowOptions(url)

  const uri = url.replace(DEEPLINK_SCHEME, "/")
  try {
    const { pathname, searchParams } = new URL(uri, "https://follow.dev")

    const pathnameTrimmed = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname

    switch (pathnameTrimmed) {
      case "/add": {
        callMainWindow(url, (mainWindow) => {
          const caller = callWindowExpose(mainWindow)

          const id = searchParams.get("id") ?? undefined
          const isList = searchParams.get("type") === "list"
          const urlParam = searchParams.get("url") ?? undefined
          if (!id && !urlParam) return
          caller.follow({ isList, id, url: urlParam })
        })
        return
      }
      case "/discover": {
        callMainWindow(url, (mainWindow) => {
          const caller = callWindowExpose(mainWindow)

          const route = searchParams.get("route") ?? undefined

          if (!route) return
          caller.rsshubRoute(route)
        })
        return
      }
      case "/": {
        callMainWindow(url, (mainWindow) => {
          mainWindow.restore()
          mainWindow.focus()
        })
        return
      }

      default: {
        const { height, resizable = true, width } = options || {}
        createWindow({
          extraPath: `#${uri}`,
          width: width ?? 800,
          height: height ?? 700,
          minWidth: 600,
          minHeight: 600,
          resizable,
        })
        return
      }
    }
  } catch (err) {
    logger.error("routing error:", err)
  }
}

const callMainWindow = (url: string, fn: (mainWindow: BrowserWindow) => any) => {
  const mainWindow = getMainWindow()
  if (!mainWindow) {
    createMainWindow()

    return handleUrlRouting(url)
  }
  mainWindow.restore()
  mainWindow.focus()
  fn(mainWindow)
}
