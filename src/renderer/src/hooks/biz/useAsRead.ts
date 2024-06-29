import { FEED_COLLECTION_LIST } from "@renderer/lib/constants"
import type { CombinedEntryModel } from "@renderer/models"

import { useRouteParamsSelector } from "./useRouteParams"

export function useAsRead(entry?: CombinedEntryModel) {
  return useRouteParamsSelector((params) => {
    if (params.feedId === FEED_COLLECTION_LIST) {
      return false
    }
    if (!entry) return false
    return entry.read
  }, [entry?.read])
}
