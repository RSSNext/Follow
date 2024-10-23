/* eslint-disable no-param-reassign */
import { readFileSync } from "node:fs"
import path, { resolve } from "node:path"

import { env } from "@follow/shared/env"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { parseHTML } from "linkedom"
import { FetchError } from "ofetch"

import { isDev } from "~/lib/env"
import { buildSeoMetaTags } from "~/lib/seo"

import { injectMetaHandler } from "../meta-handler"

const devHandler = (app: FastifyInstance) => {
  app.get("*", async (req, reply) => {
    const url = req.originalUrl

    const root = resolve(__dirname, "../..")

    const vite = require("../lib/dev-vite").getViteServer()
    try {
      let template = readFileSync(path.resolve(root, vite.config.root, "index.html"), "utf-8")
      template = await vite.transformIndexHtml(url, template)
      template = await safeInjectMetaToTemplate(template, req, reply)

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
    let template = require("../../.generated/index.template").default
    template = await safeInjectMetaToTemplate(template, req, reply)

    const isInVercelReverseProxy = req.headers["x-middleware-subrequest"]

    const upstreamEnv = req.requestContext.get("upstreamEnv")
    if (isInVercelReverseProxy || upstreamEnv === "prod") {
      // Add asset prefix
      // Map all link and script to /assets
      // <script type="module" crossorigin src="/assets/index-kQ31_hj7.js"></script>
      // <link rel="stylesheet" crossorigin href="/assets/index-BORNdGZP.css">
      const prefix = "/external-dist"
      const { document } = parseHTML(template)
      for (const script of document.querySelectorAll("script")) {
        script.src = `${prefix}${script.src}`
      }
      for (const link of document.querySelectorAll("link")) {
        link.href = `${prefix}${link.href}`
      }

      const upstreamEnv = req.requestContext.get("upstreamEnv")

      if (upstreamEnv) {
        document.head.prepend(document.createComment(`upstreamEnv: ${upstreamEnv}`))

        // override client side api url

        const upstreamOrigin = req.requestContext.get("upstreamOrigin")

        const injectScript = (apiUrl: string) => {
          const template = `function injectEnv(env2) {
    for (const key in env2) {
      if (env2[key] === void 0) continue;
      globalThis["__followEnv"] ??= {};
      globalThis["__followEnv"][key] = env2[key];
    }
  }
injectEnv({"VITE_API_URL":"${apiUrl}","VITE_EXTERNAL_API_URL":"${apiUrl}","VITE_WEB_URL":"${upstreamOrigin}"})`
          const $script = document.createElement("script")
          $script.innerHTML = template
          document.head.prepend($script)
        }
        if (upstreamEnv === "dev" && env.VITE_EXTERNAL_DEV_API_URL) {
          injectScript(env.VITE_EXTERNAL_DEV_API_URL)
        }
        if (upstreamEnv === "prod" && env.VITE_EXTERNAL_PROD_API_URL) {
          injectScript(env.VITE_EXTERNAL_PROD_API_URL)
        }
      }

      template = document.toString()
    }

    reply.type("text/html")
    reply.send(template)
  })
}

export const globalRoute = isDev ? devHandler : prodHandler

async function safeInjectMetaToTemplate(template: string, req: FastifyRequest, res: FastifyReply) {
  try {
    return await injectMetaToTemplate(template, req)
  } catch (e) {
    console.error("inject meta error", e)

    if (e instanceof FetchError && e.response?.status) {
      res.code(e.response.status)
    }

    template = template.replace(`<!-- TITLE -->`, `Follow`)

    return template
  }
}
async function injectMetaToTemplate(template: string, req: FastifyRequest) {
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
      case "openGraph": {
        allMetaString.push(buildSeoMetaTags({ openGraph: meta }))
        break
      }
      case "meta": {
        allMetaString.push(`<meta property="${meta.property}" content="${meta.content}" />`)
        break
      }
      case "title": {
        if (meta.title) {
          template = template.replace(`<!-- TITLE -->`, `${meta.title} | Follow`)
          isTitleReplaced = true
        }
        break
      }
      case "hydrate": {
        const { document } = parseHTML(template)
        // Insert hydrate script
        const script = document.createElement("script")
        script.innerHTML = `
          window.__HYDRATE__ = window.__HYDRATE__ || {}
          window.__HYDRATE__['${meta.key}'] = ${JSON.stringify(meta.data)}
        `
        document.head.append(script)
        template = document.toString()
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
