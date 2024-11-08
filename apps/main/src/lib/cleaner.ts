import { statSync } from "node:fs"
import fsp from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { promisify } from "node:util"

import { callWindowExpose } from "@follow/shared/bridge"
import { app, dialog } from "electron"

import { logger } from "~/logger"
import { getMainWindow } from "~/window"

import { t } from "./i18n"
import { store, StoreKey } from "./store"

const require = createRequire(import.meta.url)
const fastFolderSize = require("fast-folder-size") as any as typeof import("fast-folder-size")

export const clearAllDataAndConfirm = async () => {
  const win = getMainWindow()
  if (!win) return

  // Dialog to confirm
  const result = await dialog.showMessageBox({
    type: "warning",

    message: t("dialog.clearAllData"),
    buttons: [t("dialog.yes"), t("dialog.no")],
  })

  if (result.response === 1) {
    return
  }
  return clearAllData()
}

export const clearAllData = async () => {
  const win = getMainWindow()
  if (!win) return
  const ses = win.webContents.session
  const caller = callWindowExpose(win)

  try {
    await ses.clearCache()

    await ses.clearStorageData({
      storages: [
        "websql",
        "filesystem",
        "indexdb",
        "localstorage",
        "shadercache",
        "websql",
        "serviceworkers",
        "cookies",
      ],
    })

    caller.toast.success("App data reset successfully")

    // reload the app
    win.reload()
  } catch (error: any) {
    caller.toast.error(`Error resetting app data: ${error.message}`)
  }
}
const fastFolderSizeAsync = promisify(fastFolderSize)
export const getCacheSize = async () => {
  const cachePath = path.join(app.getPath("userData"), "cache")

  // Size is in bytes
  const sizeInBytes = await fastFolderSizeAsync(cachePath)
  return sizeInBytes || 0
}

const getCachedFilesRecursive = async (dir: string, result: string[] = []) => {
  const files = await fsp.readdir(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = await fsp.stat(filePath)
    if (stat.isDirectory()) {
      const files = await getCachedFilesRecursive(filePath)
      result.push(...files)
    } else {
      result.push(filePath)
    }
  }
  return result
}

let timer: any = null
export const clearCacheCronJob = () => {
  if (timer) {
    timer = clearInterval(timer)
  }
  timer = setInterval(
    async () => {
      const hasLimit = store.get(StoreKey.CacheSizeLimit)

      if (!hasLimit) {
        return
      }

      const cacheSize = await getCacheSize()

      const limitByteSize = hasLimit * 1024 * 1024
      if (cacheSize > limitByteSize) {
        const shouldCleanSize = cacheSize - limitByteSize - 1024 * 1024 * 50 // 50MB

        const cachePath = path.join(app.getPath("userData"), "cache")
        const files = await getCachedFilesRecursive(cachePath)
        // Sort by last modified
        files.sort((a, b) => {
          const aStat = statSync(a)
          const bStat = statSync(b)
          return bStat.mtime.getTime() - aStat.mtime.getTime()
        })

        let cleanedSize = 0
        for (const file of files) {
          const fileSize = statSync(file).size
          cleanedSize += fileSize
          if (cleanedSize >= shouldCleanSize) {
            logger.info(`Cleaned ${cleanedSize} bytes cache`)
            break
          }
        }
      }
    },
    10 * 60 * 1000,
  ) // 10 min

  return () => {
    if (!timer) return
    timer = clearInterval(timer)
  }
}
