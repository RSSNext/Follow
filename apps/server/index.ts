import "./src/lib/load-env"

import { createRequire } from "node:module"

import middie from "@fastify/middie"
import Fastify from "fastify"

import { globalRoute } from "./src/router/global"
import { ogRoute } from "./src/router/og"

const app = Fastify({})

await app.register(middie, {
  hook: "onRequest",
})

if (process.env.NODE_ENV === "development") {
  const require = createRequire(import.meta.url)
  const devVite = require("./src/lib/dev-vite")
  await devVite.registerDevViteServer(app)
}

ogRoute(app)
globalRoute(app)

const isVercel = process.env.VERCEL === "1"
if (!isVercel) {
  await app.listen({ port: 2234 })
  console.info("Server is running on http://localhost:2234")
}

export { app }
