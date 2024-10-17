import { callWindowExpose } from "@follow/shared/bridge"
import { DEEPLINK_SCHEME } from "@follow/shared/constants"
import { extractElectronWindowOptions } from "@follow/shared/electron"

import { logger } from "~/logger"
import { createMainWindow, createWindow, getMainWindow } from "~/window"

export const handleUrlRouting = (url: string) => {
  const options = extractElectronWindowOptions(url)

  const uri = url.replace(DEEPLINK_SCHEME, "/")
  try {
    const { pathname, searchParams } = new URL(uri, "https://follow.dev")

    switch (pathname) {
      case "/add":
      case "/add/": {
        const mainWindow = getMainWindow()
        if (!mainWindow) {
          createMainWindow()

          return handleUrlRouting(url)
        }
        mainWindow.restore()
        mainWindow.focus()
        const caller = callWindowExpose(mainWindow)

        const id = searchParams.get("id") ?? undefined
        const isList = searchParams.get("type") === "list"
        const urlParam = searchParams.get("url") ?? undefined
        if (!id && !urlParam) return
        caller.follow({ isList, id, url: urlParam })
        return
      }
      default: {
        break
      }
    }

    return
  } catch (err) {
    logger.error("routing error:", err)
  }
  const { height, resizable = true, width } = options || {}
  createWindow({
    extraPath: `#${uri}`,
    width: width ?? 800,
    height: height ?? 700,
    minWidth: 600,
    minHeight: 600,
    resizable,
  })
}
