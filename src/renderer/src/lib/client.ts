import { createClient } from "@egoist/tipc/renderer"
import type { Router } from "@main/tipc"

export const client = createClient<Router>({
  ipcInvoke: window.electron.ipcRenderer.invoke,
})
