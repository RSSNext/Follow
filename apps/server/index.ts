import "./src/lib/load-env"

import middie from "@fastify/middie"
import Fastify from "fastify"

import { isDev } from "~/lib/env"

import { globalRoute } from "./src/router/global"
import { ogRoute } from "./src/router/og"

const isVercel = process.env.VERCEL === "1"

export const createApp = async () => {
  const app = Fastify({})

  await app.register(middie, {
    hook: "onRequest",
  })

  if (isDev) {
    const devVite = require("./src/lib/dev-vite")
    await devVite.registerDevViteServer(app)
  }

  ogRoute(app)
  globalRoute(app)

  return app
}

if (!isVercel) {
  createApp().then(async (app) => {
    await app.listen({ port: 2234 })
    console.info("Server is running on http://localhost:2234")
  })
}
