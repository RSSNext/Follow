import os from "node:os"
import { platform } from "node:process"

import { electronAPI } from "@electron-toolkit/preload"
import { contextBridge } from "electron"

export const isMacOS = platform === "darwin"

export const isWindows = platform === "win32"

export const isLinux = platform === "linux"
export const isWindows11 = isWindows && os.version().startsWith("Windows 11")

// Custom APIs for renderer
const api = {
  canWindowBlur: process.platform === "darwin" || (process.platform === "win32" && isWindows11),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("api", api)
    contextBridge.exposeInMainWorld("platform", process.platform)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.platform = process.platform
}
