import path from "node:path"

import { registerIpcMain } from "@egoist/tipc/main"
import { APP_PROTOCOL } from "@follow/shared/constants"
import { app, nativeTheme, shell } from "electron"
import contextMenu from "electron-context-menu"

import { getIconPath } from "./helper"
import { t } from "./lib/i18n"
import { store } from "./lib/store"
import { registerAppMenu } from "./menu"
import { initializeSentry } from "./sentry"
import { router } from "./tipc"

const appFolder = {
  prod: "Follow",
  dev: "Follow (dev)",
}

const isDev = process.env.NODE_ENV === "development"
export const initializeApp = () => {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [
        path.resolve(process.argv[1]),
      ])
    }
  } else {
    app.setAsDefaultProtocolClient(APP_PROTOCOL)
  }

  initializeSentry()

  registerIpcMain(router)

  app.setPath("appData", path.join(app.getPath("appData"), isDev ? appFolder.dev : appFolder.prod))

  if (app.dock) {
    app.dock.setIcon(getIconPath())
  }

  // store.set("appearance", input);
  const appearance = store.get("appearance")
  if (appearance && ["light", "dark", "system"].includes(appearance)) {
    nativeTheme.themeSource = appearance
  }
  // In this file you can include the rest of your app"s specific main process
  // code. You can also put them in separate files and require them here.

  registerMenuAndContextMenu()
}

export const registerMenuAndContextMenu = () => {
  registerAppMenu()
  contextMenu({
    showSaveImageAs: true,
    showCopyLink: true,
    showCopyImageAddress: true,
    showCopyImage: true,
    showInspectElement: isDev,
    showSelectAll: false,
    showCopyVideoAddress: true,
    showSaveVideoAs: true,

    labels: {
      saveImageAs: t("contextMenu.saveImageAs"),
      copyLink: t("contextMenu.copyLink"),
      copyImageAddress: t("contextMenu.copyImageAddress"),
      copyImage: t("contextMenu.copyImage"),
      copyVideoAddress: t("contextMenu.copyVideoAddress"),
      saveVideoAs: t("contextMenu.saveVideoAs"),
      inspect: t("contextMenu.inspect"),
    },

    prepend: (_defaultActions, params) => {
      return [
        {
          label: t("contextMenu.openImageInBrowser"),
          visible: params.mediaType === "image",
          click: () => {
            shell.openExternal(params.srcURL)
          },
        },
        {
          label: t("contextMenu.openLinkInBrowser"),
          visible: params.linkURL !== "",
          click: () => {
            shell.openExternal(params.linkURL)
          },
        },
      ]
    },
  })
}
