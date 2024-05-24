import { createClient } from "@egoist/tipc/renderer"
import type { Router } from "@main/tipc"

export const client = window.electron
  ? createClient<Router>({
      ipcInvoke: window.electron.ipcRenderer.invoke,
    })
  : null
