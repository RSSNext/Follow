import { name } from "@pkg"
import { dispatchEventOnWindow } from "@shared/event"
import type { MenuItem, MenuItemConstructorOptions } from "electron"
import { Menu } from "electron"

import { isDev, isMacOS } from "./env"
import { revealLogFile } from "./logger"
import { checkForUpdates, quitAndInstall } from "./updater"
import { createSettingWindow, createWindow, getMainWindow } from "./window"

export const registerAppMenu = () => {
  const menus: Array<MenuItemConstructorOptions | MenuItem> = [
    ...(isMacOS
      ? ([
          {
            label: name,
            submenu: [
              {
                type: "normal",
                label: `About ${name}`,
                click: () => {
                  createSettingWindow("about")
                },
              },
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
        ] as MenuItemConstructorOptions[])
      : []),

    {
      role: "fileMenu",
      submenu: [
        {
          type: "normal",
          label: "Quick Add",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            const mainWindow = getMainWindow()
            if (!mainWindow) return
            mainWindow.show()
            dispatchEventOnWindow(mainWindow, "QuickAdd")
          },
        },

        {
          type: "normal",
          label: "Discover",
          accelerator: "CmdOrCtrl+T",
          click: () => {
            const mainWindow = getMainWindow()
            if (!mainWindow) return
            mainWindow.show()
            dispatchEventOnWindow(mainWindow, "Discover")
          },
        },

        { type: "separator" },
        { role: "close" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { type: "separator" },
        {
          type: "normal",
          label: "Search",
          accelerator: "CmdOrCtrl+F",
          click(_e, window) {
            if (!window) return
            dispatchEventOnWindow(window, "OpenSearch")
          },
        },
        ...((isMacOS
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [
              { role: "delete" },
              { type: "separator" },
              { role: "selectAll" },
            ]) as MenuItemConstructorOptions[]),
      ],
    },
    {
      role: "viewMenu",
    },
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
        {
          label: "Check for Updates",
          click: async () => {
            getMainWindow()?.show()
            await checkForUpdates()
          },
        },
      ],
    },
  ]

  if (isDev) {
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
        {
          type: "normal",
          label: "Debug: Quit and Install Update",
          click() {
            quitAndInstall()
          },
        },
      ],
    })
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}
