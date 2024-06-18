import type {
  BrowserWindow,
  MenuItem,
  MenuItemConstructorOptions,
} from "electron"
import { Menu } from "electron"

import { createWindow } from "./window"

const windows = {
  settingWindow: null as BrowserWindow | null,
}
export const registerAppMenu = () => {
  const menus: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      role: "appMenu",
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Settings...",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            if (windows.settingWindow) {
              windows.settingWindow.show()
              return
            }
            const window = createWindow({
              extraPath: "/settings",
              width: 700,
              height: 600,
              resizable: false,
            })

            windows.settingWindow = window
            window.on("closed", () => {
              windows.settingWindow = null
            })
          },
        },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    { role: "fileMenu" },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
    { role: "help" },
  ]

  if (import.meta.env.DEV) {
    menus.push({
      label: "Dev",
      submenu: [
        {
          label: "follow https://rsshub.app/twitter/user/DIYgod",
          click: () => {
            createWindow({
              extraPath: `/add?url=${encodeURIComponent(
                "https://rsshub.app/twitter/user/DIYgod",
              )}`,
              width: 800,
              height: 600,
            })
          },
        },
        {
          label: "follow https://diygod.me/feed",
          click: () => {
            createWindow({
              extraPath: `/add?url=${encodeURIComponent(
                "https://diygod.me/feed",
              )}`,
              width: 800,
              height: 600,
            })
          },
        },
      ],
    })
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}
