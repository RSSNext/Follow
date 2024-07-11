import type { MenuItem, MenuItemConstructorOptions } from "electron"
import { Menu } from "electron"

import { revealLogFile } from "./logger"
import { createSettingWindow, createWindow } from "./window"

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
          click: () => createSettingWindow(),
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
    {
      role: "help",
      submenu: [
        {
          label: "Open log file",
          click: async () => {
            await revealLogFile()
          },
        },
      ],
    },
  ]

  if (import.meta.env.DEV) {
    menus.push({
      label: "Debug",
      submenu: [
        {
          label: "follow https://github.com/RSSNext/follow/releases.atom",
          click: () => {
            createWindow({
              extraPath: `#add?url=${encodeURIComponent(
                "https://github.com/RSSNext/follow/releases.atom",
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
