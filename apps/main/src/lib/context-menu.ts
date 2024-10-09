import type { BrowserWindow } from "electron"
import { clipboard, Menu } from "electron"

import { t } from "./i18n"

export const registerContextMenu = (window: BrowserWindow) => {
  const handler = (_event: Electron.Event, props: Electron.ContextMenuParams) => {
    const { selectionText, isEditable, linkURL } = props

    if (isEditable) {
      const inputMenu = Menu.buildFromTemplate([
        { role: "undo", label: t("menu.undo"), accelerator: "CmdOrCtrl+Z" },
        {
          role: "redo",
          label: t("menu.redo"),
          accelerator: "CmdOrCtrl+Shift+Z",
        },
        { type: "separator" },
        {
          role: "cut",
          label: t("menu.cut"),
          accelerator: "CmdOrCtrl+X",
        },
        {
          role: "copy",
          label: t("menu.copy"),
          accelerator: "CmdOrCtrl+C",
        },
        {
          role: "paste",
          label: t("menu.paste"),
          accelerator: "CmdOrCtrl+V",
        },
        {
          type: "separator",
        },
        { role: "selectAll", label: t("menu.selectAll"), accelerator: "CmdOrCtrl+A" },
      ])
      inputMenu.popup({
        window,
      })
    } else if (linkURL) {
      const linkMenu = Menu.buildFromTemplate([
        { role: "copy", label: t("menu.copy"), accelerator: "CmdOrCtrl+C" },
        // Copy link
        {
          label: t("contextMenu.copyLink"),
          accelerator: "CmdOrCtrl+Shift+C",
          click: () => {
            clipboard.writeText(linkURL)
          },
        },
      ])
      linkMenu.popup({ window })
    } else if (selectionText && selectionText.trim() !== "") {
      const selectionMenu = Menu.buildFromTemplate([
        { role: "copy", label: t("menu.copy"), accelerator: "CmdOrCtrl+C" },
        { type: "separator" },
        { role: "selectAll", label: t("menu.selectAll"), accelerator: "CmdOrCtrl+A" },
      ])
      selectionMenu.popup({ window })
    }
  }
  window.webContents.on("context-menu", handler)

  return () => {
    window.webContents.removeListener("context-menu", handler)
  }
}
