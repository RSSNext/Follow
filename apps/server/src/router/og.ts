import type { FastifyInstance } from "fastify"

import { createApiClient, getTokenFromCookie } from "../lib/api-client"

export const ogRoute = (app: FastifyInstance) => {
  app.get("/og/:type/:id", async (req, reply) => {
    const { type, id } = req.params
    const { width, height } = req.query

    const token = getTokenFromCookie(req.headers.cookie || "")
    const apiClient = createApiClient(token)
    switch (type) {
      case "feed": {
        const feed = await apiClient.feeds
          .$get({
            query: {
              id,
            },
          })
          .then((res) => res.data.feed)

        if (!feed) {
          return reply.code(404).send("Not found")
        }

        const { image } = feed
        if (!image) {
          return reply.code(404).send("Not found")
        }

        break
      }
      default: {
        return reply.code(404).send("Not found")
      }
    }
  })
}
