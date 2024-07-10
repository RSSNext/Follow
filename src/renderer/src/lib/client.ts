import { createClient, createEventHandlers } from "@egoist/tipc/renderer"
import type { RendererHandlers, Router } from "@main/tipc"

export const tipcClient = window.electron ?
  createClient<Router>({
    ipcInvoke: window.electron.ipcRenderer.invoke,
  }) :
  null

export const handlers = window.electron ?
  createEventHandlers<RendererHandlers>({
    on: (channel, callback) => {
      const unlisten = window.electron?.ipcRenderer.on(channel, callback)
      return () => {
        unlisten?.()
      }
    },
    send: window.electron.ipcRenderer.send,
  }) :
  null
