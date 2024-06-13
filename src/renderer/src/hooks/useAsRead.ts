import { FEED_COLLECTION_LIST, levels } from "@renderer/lib/constants"
import type { EntryModel } from "@renderer/models"
import { useFeedStore } from "@renderer/store"

export function useAsRead(entry?: EntryModel) {
  const activeList = useFeedStore((state) => state.activeList)

  if (!entry) return false
  return entry.read && !(activeList?.level === levels.folder && activeList?.id === FEED_COLLECTION_LIST)
}
