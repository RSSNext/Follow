import "./src/lib/load-env"

import middie from "@fastify/middie"
import { fastifyRequestContext } from "@fastify/request-context"
import type { FastifyRequest } from "fastify"
import Fastify from "fastify"

import { isDev } from "~/lib/env"

import { globalRoute } from "./src/router/global"
import { ogRoute } from "./src/router/og"

const isVercel = process.env.VERCEL === "1"

declare module "@fastify/request-context" {
  interface RequestContextData {
    req: FastifyRequest

    upstreamEnv: "prod" | "dev"
  }
}

export const createApp = async () => {
  const app = Fastify({})

  app.register(fastifyRequestContext)
  await app.register(middie, {
    hook: "onRequest",
  })

  app.addHook("onRequest", (req, reply, done) => {
    req.requestContext.set("req", req)

    const { host } = req.headers

    if (!isDev) req.requestContext.set("upstreamEnv", host?.includes("dev") ? "dev" : "prod")
    done()
  })

  if (isDev) {
    const devVite = require("./src/lib/dev-vite")
    await devVite.registerDevViteServer(app)
  }

  app.get("/metrics", (req, reply) => {
    reply.send({
      headers: req.headers,
      host: req.headers.host,
    })
  })
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
