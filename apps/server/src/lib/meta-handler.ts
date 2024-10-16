import type { FastifyRequest } from "fastify"

import { createApiClient, getTokenFromCookie } from "./api-client"
import { buildSeoMetaTags } from "./seo"

export async function injectMetaHandler(url: string, req: FastifyRequest) {
  const metaArr = [] as string[]

  const apiClient = createApiClient(getTokenFromCookie(req.headers.cookie || ""))

  const hostFromReq = req.headers.host
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https"

  switch (true) {
    case url.startsWith("/feed"): {
      const parsedUrl = new URL(url, "https://app.follow.is")
      const feedId = parsedUrl.pathname.split("/")[2]
      const feed: any = await apiClient.feeds
        .$get({
          query: {
            id: feedId,
          },
        })

        // @ts-ignore
        .then((res) => res.data.feed)

      if (!feed) {
        return ""
      }

      if (!feed.title || !feed.description) {
        return ""
      }

      metaArr.push(
        ...buildSeoMetaTags({
          openGraph: {
            title: feed.title,
            description: feed.description,
            image: `${protocol}://${hostFromReq}/og/feed/${feed.id}`,
          },
        }),
      )
      break
    }
  }

  return metaArr.join("\n")
}
