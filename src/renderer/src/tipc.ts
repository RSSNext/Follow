import { createEventHandlers } from "@egoist/tipc/renderer"
import type { RendererHandlers } from "@main/renderer-handlers"

export const handlers = ELECTRON ?
  window.electron &&
  createEventHandlers<RendererHandlers>({
    on: (channel, callback) => {
      if (!window.electron) return () => {}
      const remover = window.electron.ipcRenderer.on(channel, callback)
      return () => {
        remover()
      }
    },

    send: window.electron.ipcRenderer.send,
  }) :
  null
