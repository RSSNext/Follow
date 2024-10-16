/* eslint-disable no-param-reassign */
import { readFileSync } from "node:fs"
import path, { resolve } from "node:path"

import type { FastifyInstance, FastifyRequest } from "fastify"

import { isDev } from "~/lib/env"

import { injectMetaHandler } from "../lib/meta-handler"

// const require = createRequire(import.meta.url)

const devHandler = (app: FastifyInstance) => {
  app.get("*", async (req, reply) => {
    const url = req.originalUrl

    const root = resolve(__dirname, "../..")

    const vite = require("../lib/dev-vite").getViteServer()
    try {
      let template = readFileSync(path.resolve(root, vite.config.root, "index.html"), "utf-8")
      template = await vite.transformIndexHtml(url, template)
      template = await transfromTemplate(template, req)

      reply.type("text/html")
      reply.send(template)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      reply.code(500).send(e)
    }
  })
}
const prodHandler = (app: FastifyInstance) => {
  app.get("*", async (req, reply) => {
    // const pathname = req.originalUrl

    // if (pathname.startsWith("/assets")) {
    //   const subPath = pathname.replace("/assets", "")
    //   const content = readFileSync(path.resolve(__dirname, `../../dist/assets${subPath}`), "utf-8")

    //   const type = subPath.endsWith(".css") ? "text/css" : "application/javascript"
    //   reply.type(type)
    //   reply.send(content)
    // }

    const template = require("./index.template")

    reply.type("text/html")
    reply.send(template)
  })
}

export const globalRoute = process.env.NODE_ENV === "development" ? devHandler : prodHandler

async function transfromTemplate(template: string, req: FastifyRequest) {
  const injectMetadata = await injectMetaHandler(req).catch((err) => {
    if (isDev) {
      throw err
    }
    return []
  })

  if (!injectMetadata) {
    return template
  }

  const allMetaString = []
  let isTitleReplaced = false
  for (const meta of injectMetadata) {
    switch (meta.type) {
      case "meta": {
        allMetaString.push(`<meta property="${meta.property}" content="${meta.content}" />`)
        break
      }
      case "title": {
        template = template.replace(`<!-- TITLE -->`, meta.title)
        isTitleReplaced = true
        break
      }
    }
  }

  if (!isTitleReplaced) {
    template = template.replace(`<!-- TITLE -->`, `Follow`)
  }

  template = template.replace(`<!-- SSG-META -->`, allMetaString.join("\n"))

  return template
}
