import { FEED_COLLECTION_LIST, levels } from "@renderer/lib/constants"
import type { EntryModel } from "@renderer/models"

import { useRouteParms } from "./useRouteParams"

export function useAsRead(entry?: EntryModel) {
  const { feedId, level } = useRouteParms()

  if (!entry) return false
  return entry.read && !(level === levels.folder && feedId === FEED_COLLECTION_LIST)
}
