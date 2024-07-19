import { createClient } from "@egoist/tipc/renderer"
import type { Router } from "@main/tipc"

export const tipcClient = ELECTRON ?
  createClient<Router>({
    ipcInvoke: window.electron!.ipcRenderer.invoke,
  }) :
  null
