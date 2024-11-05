import "./src/lib/load-env"

import middie from "@fastify/middie"
import { fastifyRequestContext } from "@fastify/request-context"
import { env } from "@follow/shared/env"
import type { FastifyRequest } from "fastify"
import Fastify from "fastify"
import { nanoid } from "nanoid"
import { FetchError } from "ofetch"

import { isDev } from "~/lib/env"
import { MetaError } from "~/meta-handler"

import { globalRoute } from "./src/router/global"
import { ogRoute } from "./src/router/og"

const isVercel = process.env.VERCEL === "1"

declare module "@fastify/request-context" {
  interface RequestContextData {
    req: FastifyRequest

    upstreamEnv: "prod" | "dev"
    upstreamOrigin: string
  }
}

export const createApp = async () => {
  const app = Fastify({})

  app.register(fastifyRequestContext)
  await app.register(middie, {
    hook: "onRequest",
  })

  app.setErrorHandler(function (err, req, reply) {
    this.log.error(err)

    const traceId = nanoid(8)

    if (err instanceof FetchError) {
      reply
        .status((err as FetchError).response?.status || 500)
        .send({ ok: false, traceId, message: err.message })
    } else if (err instanceof MetaError) {
      reply.status(err.status).send({ ok: false, traceId, message: err.metaMessage })
    } else {
      const message = err.message || "Internal Server Error"
      const status = Number.parseInt(err.code as string) || 500
      reply.status(status).send({ ok: false, message, traceId })
    }
  })

  app.addHook("onRequest", (req, reply, done) => {
    req.requestContext.set("req", req)

    const { host } = req.headers

    const forwardedHost = req.headers["x-forwarded-host"]
    const finalHost = forwardedHost || host

    const upstreamEnv = finalHost?.includes("dev") ? "dev" : "prod"
    if (!isDev) req.requestContext.set("upstreamEnv", upstreamEnv)
    if (upstreamEnv === "prod") {
      req.requestContext.set("upstreamOrigin", env.VITE_WEB_PROD_URL || env.VITE_WEB_URL)
    } else {
      req.requestContext.set("upstreamOrigin", env.VITE_WEB_DEV_URL || env.VITE_WEB_URL)
    }
    reply.header("x-handled-host", finalHost)
    done()
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
