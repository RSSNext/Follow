import { Readable } from "node:stream"

import type { FastifyInstance } from "fastify"
import React from "react"

import { createApiClient, getTokenFromCookie } from "~/lib/api-client"
import { renderToImage } from "~/lib/og/render-to-image"

export const ogRoute = (app: FastifyInstance) => {
  app.get("/og/:type/:id", async (req, reply) => {
    const { type, id } = req.params as Record<string, string>

    const token = getTokenFromCookie(req.headers.cookie || "")
    const apiClient = createApiClient(token)

    switch (type) {
      case "feed": {
        const feed = await apiClient.feeds.$get({ query: { id } }).catch(() => null)

        if (!feed?.data.feed) {
          return reply.code(404).send("Not found")
        }

        const { title, description } = feed.data.feed

        try {
          const imageRes = await renderToImage(
            <div
              style={{
                fontSize: 100,
                background: "white",
                width: "100%",
                height: "100%",
                display: "flex",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {title}
              {description}
            </div>,
            {
              width: 1200,
              height: 600,
            },
          )

          const stream = new Readable({
            read() {
              this.push(imageRes.image)
              this.push(null)
            },
          })

          reply.type(imageRes.contentType)
          return reply.send(stream)
        } catch (err) {
          console.error(err)
          return reply.code(500).send({ error: "Internal server error" })
        }

        break
      }
      default: {
        return reply.code(404).send("Not found")
      }
    }
  })
}
