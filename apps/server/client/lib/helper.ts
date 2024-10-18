import type { FeedOrListRespModel } from "@follow/models/types"

export const getPreferredTitle = (feed?: FeedOrListRespModel | null) => {
  if (!feed?.id) {
    return feed?.title
  }

  return feed.title
}

export const getHydrateData = (key: string) => {
  return window.__HYDRATE__[key]
}
