import { getRendererHandlers } from "@egoist/tipc/main"
import { autoUpdater as defaultAutoUpdater } from "electron-updater"

import { GITHUB_OWNER, GITHUB_REPO } from "~/constants/app"
import { canUpdateRender, CanUpdateRenderState, hotUpdateRender } from "~/updater/hot-updater"

import { channel, isDev, isWindows } from "../env"
import { logger } from "../logger"
import type { RendererHandlers } from "../renderer-handlers"
import { destroyMainWindow, getMainWindow } from "../window"
import { appUpdaterConfig } from "./configs"
import { CustomGitHubProvider } from "./custom-github-provider"
import { WindowsUpdater } from "./windows-updater"

// skip auto update in dev mode
// const disabled = isDev
const disabled = !appUpdaterConfig.enableAppUpdate

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

const upgradeRenderIfNeeded = async () => {
  const [state, manifest] = await canUpdateRender()
  if (state === CanUpdateRenderState.NO_NEEDED) {
    return true
  }
  if (state === CanUpdateRenderState.NEEDED && manifest) {
    await hotUpdateRender(manifest)
    return true
  }
  return false
}
export const checkForAppUpdates = async () => {
  if (disabled || checkingUpdate) {
    return
  }

  checkingUpdate = true
  try {
    if (appUpdaterConfig.enableRenderHotUpdate) {
      const isRenderUpgraded = await upgradeRenderIfNeeded()
      if (isRenderUpgraded) {
        return
      }
    }
    return autoUpdater.checkForUpdates()
  } catch (e) {
    logger.error("Error checking for updates", e)
  } finally {
    checkingUpdate = false
  }
}

export const downloadAppUpdate = async () => {
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

  // Disable there, control this in event
  autoUpdater.autoDownload = false
  autoUpdater.allowPrerelease = channel !== "stable"
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.autoRunAppAfterInstall = true

  const feedUrl: Exclude<Parameters<typeof autoUpdater.setFeedURL>[0], string> = {
    channel,
    // hack for custom provider
    provider: "custom" as "github",
    repo: GITHUB_REPO,
    owner: GITHUB_OWNER,
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
  autoUpdater.on("update-available", async (info) => {
    logger.info("Update available", info)

    // The app hotfix strategy is as follows:
    // Determine whether the app should be updated in full or only the renderer layer based on the version number.
    // https://www.notion.so/rss3/Follow-Hotfix-Electron-Renderer-layer-RFC-fe2444b9ac194c2cb38f9fa0bb1ef3c1?pvs=4#12e35ea049b480f1b268f1e605d86a62
    if (appUpdaterConfig.enableRenderHotUpdate) {
      const isRenderUpgraded = await upgradeRenderIfNeeded()
      if (isRenderUpgraded) {
        return
      }
    }

    if (appUpdaterConfig.app.autoDownloadUpdate) {
      downloadAppUpdate().catch((err) => {
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
    if (appUpdaterConfig.app.autoCheckUpdate) {
      checkForAppUpdates().catch((err) => {
        logger.error("Error checking for updates", err)
      })
    }
  }, appUpdaterConfig.app.checkUpdateInterval)
  if (appUpdaterConfig.app.autoCheckUpdate) {
    checkForAppUpdates().catch((err) => {
      logger.error("Error checking for updates", err)
    })
  }
}
