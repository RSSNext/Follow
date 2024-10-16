import type { FastifyRequest } from "fastify"

import { createApiClient, getTokenFromCookie } from "./api-client"

interface MetaTagdata {
  type: "meta"
  property: string
  content: string
}

interface MetaTitle {
  type: "title"
  title: string
}

export type MetaTag = MetaTagdata | MetaTitle

export async function injectMetaHandler(req: FastifyRequest): Promise<MetaTag[]> {
  const metaArr = [] as MetaTag[]

  // eslint-disable-next-line unused-imports/no-unused-vars
  const apiClient = createApiClient(getTokenFromCookie(req.headers.cookie || ""))

  const hostFromReq = req.headers.host
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https"

  const url = req.originalUrl

  switch (true) {
    case url.startsWith("/share/feeds"): {
      const feedId = url.slice(url.lastIndexOf("/") + 1)

      metaArr.push({
        type: "meta",
        property: "og:image",
        content: `${protocol}://${hostFromReq}/og/feed/${feedId}`,
      })
    }
  }

  return metaArr
}
