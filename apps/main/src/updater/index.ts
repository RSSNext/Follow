import { getRendererHandlers } from "@egoist/tipc/main"
import { autoUpdater as defaultAutoUpdater } from "electron-updater"

import { channel, isDev, isWindows } from "../env"
import { logger } from "../logger"
import type { RendererHandlers } from "../renderer-handlers"
import { destroyMainWindow, getMainWindow } from "../window"
import { CustomGitHubProvider } from "./custom-github-provider"
import { WindowsUpdater } from "./windows-updater"

// skip auto update in dev mode
const disabled = isDev

const autoUpdater = isWindows ? new WindowsUpdater() : defaultAutoUpdater

export const quitAndInstall = () => {
  const mainWindow = getMainWindow()

  destroyMainWindow()
  logger.info("Quit and install update, close main window, ", mainWindow?.id)

  setTimeout(() => {
    logger.info("Window is closed, quit and install update")
    autoUpdater.quitAndInstall()
  }, 1000)
}

let downloading = false
let checkingUpdate = false

export type UpdaterConfig = {
  autoCheckUpdate: boolean
  autoDownloadUpdate: boolean
  checkUpdateInterval: number
}

const config: UpdaterConfig = {
  autoCheckUpdate: true,
  autoDownloadUpdate: true,
  checkUpdateInterval: 15 * 60 * 1000,
}

export const checkForUpdates = async () => {
  if (disabled || checkingUpdate) {
    return
  }
  checkingUpdate = true
  try {
    const info = await autoUpdater.checkForUpdates()
    return info
  } finally {
    checkingUpdate = false
  }
}

export const downloadUpdate = async () => {
  if (disabled || downloading) {
    return
  }
  downloading = true
  autoUpdater.downloadUpdate().catch((e) => {
    downloading = false
    logger.error("Failed to download update", e)
  })
  logger.info("Update available, downloading...")
  return
}

export const registerUpdater = async () => {
  if (disabled) {
    return
  }

  const allowAutoUpdate = true

  autoUpdater.autoDownload = false
  autoUpdater.allowPrerelease = channel !== "stable"
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.autoRunAppAfterInstall = true

  const feedUrl: Exclude<Parameters<typeof autoUpdater.setFeedURL>[0], string> = {
    channel,
    // hack for custom provider
    provider: "custom" as "github",
    repo: "follow",
    owner: "RSSNext",
    releaseType: channel === "stable" ? "release" : "prerelease",
    // @ts-expect-error hack for custom provider
    updateProvider: CustomGitHubProvider,
  }

  logger.debug("auto-updater feed config", {
    ...feedUrl,
    updateProvider: undefined,
  })

  autoUpdater.setFeedURL(feedUrl)

  // register events for checkForUpdates
  autoUpdater.on("checking-for-update", () => {
    logger.info("Checking for update")
  })
  autoUpdater.on("update-available", (info) => {
    logger.info("Update available", info)
    if (config.autoDownloadUpdate && allowAutoUpdate) {
      downloadUpdate().catch((err) => {
        logger.error(err)
      })
    }
  })
  autoUpdater.on("update-not-available", (info) => {
    logger.info("Update not available", info)
  })
  autoUpdater.on("download-progress", (e) => {
    logger.info(`Download progress: ${e.percent}`)
  })
  autoUpdater.on("update-downloaded", () => {
    downloading = false
    logger.info("Update downloaded, ready to install")

    const mainWindow = getMainWindow()
    if (!mainWindow) return
    const handlers = getRendererHandlers<RendererHandlers>(mainWindow.webContents)

    handlers.updateDownloaded.send()
  })
  autoUpdater.on("error", (e) => {
    logger.error("Error while updating client", e)
  })
  autoUpdater.forceDevUpdateConfig = isDev

  setInterval(() => {
    if (config.autoCheckUpdate) {
      checkForUpdates().catch((err) => {
        logger.error("Error checking for updates", err)
      })
    }
  }, config.checkUpdateInterval)
  if (config.autoCheckUpdate) {
    checkForUpdates().catch((err) => {
      logger.error("Error checking for updates", err)
    })
  }
}
