import type { FeedOrListRespModel } from "@follow/models/types"

export const getPreferredTitle = (feed?: FeedOrListRespModel | null) => {
  if (!feed?.id) {
    return feed?.title
  }

  return feed.title
}
