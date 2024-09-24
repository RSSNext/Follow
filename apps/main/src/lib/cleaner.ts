import { callWindowExpose } from "@follow/shared/bridge"
import { dialog } from "electron"

import { getMainWindow } from "~/window"

import { t } from "./i18n"

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
