import { FEED_COLLECTION_LIST, levels } from "@renderer/lib/constants"
import type { CombinedEntryModel } from "@renderer/models"

import { useRouteParamsSelector } from "./useRouteParams"

export function useAsRead(entry?: CombinedEntryModel) {
  return useRouteParamsSelector(({ feedId, level }) => {
    if (!entry) return false
    return entry.read && !(level === levels.folder && feedId === FEED_COLLECTION_LIST)
  }, [entry?.read])
}
