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
      case "/add": {
        const mainWindow = getMainWindow()
        if (!mainWindow) {
          createMainWindow()

          return handleUrlRouting(url)
        }
        mainWindow.restore()
        mainWindow.focus()
        const caller = callWindowExpose(mainWindow)

        const id = searchParams.get("id")
        const isList = searchParams.get("type") === "list"
        if (!id) return
        caller.follow(id, { isList })
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
