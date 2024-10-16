import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import type { FastifyInstance } from "fastify"
import type { ViteDevServer } from "vite"
import { createServer as createViteServer } from "vite"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")

let globalVite: ViteDevServer
export const registerDevViteServer = async (app: FastifyInstance) => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",

    configFile: resolve(root, "vite.config.ts"),
  })
  globalVite = vite

  // @ts-ignore
  app.use(vite.middlewares)
  return vite
}

export const getViteServer = () => {
  return globalVite
}
