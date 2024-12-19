import type { FeedModel } from "@/src/database/schemas/types"

import { useFeedStore } from "./store"

const get = useFeedStore.getState
export const getFeed = (id: string): FeedModel | null => {
  return get().feeds[id] || null
}
