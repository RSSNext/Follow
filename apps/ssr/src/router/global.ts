import { readFileSync } from "node:fs"
import path, { resolve } from "node:path"

import { env } from "@follow/shared/env"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { minify } from "html-minifier-terser"
import { parseHTML } from "linkedom"
import { FetchError } from "ofetch"
import xss from "xss"

import { isDev } from "~/lib/env"
import { buildSeoMetaTags } from "~/lib/seo"

import { injectMetaHandler, MetaError } from "../meta-handler"

const devHandler = (app: FastifyInstance) => {
  app.get("*", async (req, reply) => {
    const url = req.originalUrl

    const root = resolve(__dirname, "../..")

    const vite = require("../lib/dev-vite").getViteServer()
    try {
      let template = readFileSync(path.resolve(root, vite.config.root, "index.html"), "utf-8")
      template = await vite.transformIndexHtml(url, template)
      const { document } = parseHTML(template)
      await safeInjectMetaToTemplate(document, req, reply)

      reply.type("text/html")
      reply.send(document.toString())
    } catch (e) {
      vite.ssrFixStacktrace(e)
      reply.code(500).send(e)
    }
  })
}
const prodHandler = (app: FastifyInstance) => {
  app.get("*", async (req, reply) => {
    const template = require("../../.generated/index.template").default
    const { document } = parseHTML(template)
    await safeInjectMetaToTemplate(document, req, reply)

    const isInVercelReverseProxy = req.headers["x-middleware-subrequest"]

    const upstreamEnv = req.requestContext.get("upstreamEnv")
    if (isInVercelReverseProxy || upstreamEnv === "prod") {
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
    }

    reply.type("text/html")
    reply.send(
      await minify(document.toString(), {
        removeComments: true,
        html5: true,
        minifyJS: true,
        minifyCSS: true,
        removeTagWhitespace: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
      }),
    )
  })
}
export const globalRoute = isDev ? devHandler : prodHandler

async function safeInjectMetaToTemplate(
  document: Document,
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    return await injectMetaToTemplate(document, req, res)
  } catch (e) {
    console.error("inject meta error", e)

    if (e instanceof FetchError && e.response?.status) {
      res.code(e.response.status)
    }

    if (e instanceof MetaError) {
      throw e
    }
    return document
  }
}

async function injectMetaToTemplate(document: Document, req: FastifyRequest, res: FastifyReply) {
  const injectMetadata = await injectMetaHandler(req, res).catch((err) => {
    if (isDev) {
      throw err
    }
    return []
  })

  if (!injectMetadata) {
    return document
  }

  for (const meta of injectMetadata) {
    switch (meta.type) {
      case "openGraph": {
        const $metaArray = buildSeoMetaTags(document, { openGraph: meta })
        for (const $meta of $metaArray) {
          document.head.append($meta)
        }
        break
      }
      case "meta": {
        const $meta = document.createElement("meta")
        $meta.setAttribute("property", meta.property)
        $meta.setAttribute("content", xss(meta.content))
        document.head.append($meta)
        break
      }
      case "title": {
        if (meta.title) {
          const $title = document.querySelector("title")
          if ($title) {
            $title.textContent = `${xss(meta.title)} | Follow`
          } else {
            const $head = document.querySelector("head")
            if ($head) {
              const $title = document.createElement("title")
              $title.textContent = `${xss(meta.title)} | Follow`
              $head.append($title)
            }
          }
        }
        break
      }
      case "hydrate": {
        // Insert hydrate script
        const script = document.createElement("script")
        script.innerHTML = `
          window.__HYDRATE__ = window.__HYDRATE__ || {}
          window.__HYDRATE__[${JSON.stringify(meta.key)}] = JSON.parse(${JSON.stringify(JSON.stringify(meta.data))})
        `
        document.head.append(script)
        break
      }
    }
  }

  return document
}
