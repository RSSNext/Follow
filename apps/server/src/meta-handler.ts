import { isBizId } from "@follow/utils/utils"
import type { FastifyRequest } from "fastify"

import { createApiClient } from "./lib/api-client"

interface MetaTagdata {
  type: "meta"
  property: string
  content: string
}

interface MetaOpenGraph {
  type: "openGraph"
  title: string
  description?: string
  image?: string | null
}

interface MetaTitle {
  type: "title"
  title: string
}

interface MetaHydrateData {
  type: "hydrate"
  data: any
  path: string
  key: string
}
export type MetaTag = MetaTagdata | MetaOpenGraph | MetaTitle | MetaHydrateData

export async function injectMetaHandler(req: FastifyRequest): Promise<MetaTag[]> {
  const metaArr = [] as MetaTag[]

  const apiClient = createApiClient()

  const hostFromReq = req.headers.host
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https"

  const url = req.originalUrl

  switch (true) {
    case url.startsWith("/share/feeds"): {
      const parsedUrl = new URL(url, `https://${hostFromReq}`)
      const feedId = parsedUrl.pathname.split("/")[3]

      const feed = await apiClient.feeds.$get({ query: { id: feedId } })

      const { title, description } = feed.data.feed
      metaArr.push(
        {
          type: "openGraph",
          title: title || "",
          description: description || "",
          image: `${protocol}://${hostFromReq}/og/feed/${feedId}`,
        },
        {
          type: "title",
          title: title || "",
        },
        {
          type: "hydrate",
          data: feed.data,
          path: apiClient.feeds.$url({ query: { id: feedId } }).pathname,
          key: `feeds.$get,query:id=${feedId}`,
        },
      )
      break
    }
    case url.startsWith("/share/lists"): {
      const parsedUrl = new URL(url, `https://${hostFromReq}`)
      const listId = parsedUrl.pathname.split("/")[3]

      const list = await apiClient.lists.$get({ query: { listId } })

      const { title, description } = list.data.list
      metaArr.push(
        {
          type: "openGraph",
          title: title || "",
          description: description || "",
          image: `${protocol}://${hostFromReq}/og/list/${listId}`,
        },
        {
          type: "title",
          title: title || "",
        },
        {
          type: "hydrate",
          data: list.data,
          path: apiClient.lists.$url({ query: { listId } }).pathname,
          key: `lists.$get,query:listId=${listId}`,
        },
      )
      break
    }
    case url.startsWith("/share/users"): {
      const parsedUrl = new URL(url, `https://${hostFromReq}`)
      const userId = parsedUrl.pathname.split("/")[3]

      const handle = isBizId(userId || "")
        ? userId
        : `${userId}`.startsWith("@")
          ? `${userId}`.slice(1)
          : userId

      const res = await apiClient.profiles.$get({
        query: {
          handle,
          id: isBizId(handle || "") ? handle : undefined,
        },
      })
      const { name } = res.data

      metaArr.push(
        {
          type: "title",
          title: name || "",
        },
        {
          type: "openGraph",
          title: name || "",
          image: `${protocol}://${hostFromReq}/og/user/${userId}`,
        },
        {
          type: "hydrate",
          data: res.data,
          path: apiClient.profiles.$url({ query: { id: userId } }).pathname,
          key: `profiles.$get,query:id=${userId}`,
        },
      )

      break
    }
  }

  return metaArr
}
