import type ViewToken from "@shopify/flash-list/dist/viewability/ViewToken"
import { useCallback, useState } from "react"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"
import { unreadSyncService } from "@/src/store/unread/store"

const defaultIdExtractor = (item: ViewToken) => item.key
export function useOnViewableItemsChanged(
  idExtractor: (item: ViewToken) => string = defaultIdExtractor,
): (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void {
  const markAsReadWhenScrolling = useGeneralSettingKey("scrollMarkUnread")
  const markAsReadWhenRendering = useGeneralSettingKey("renderMarkUnread")

  const [stableIdExtractor] = useState(() => idExtractor)

  return useCallback(
    ({ viewableItems, changed }) => {
      debouncedFetchEntryContentByStream(viewableItems.map((item) => stableIdExtractor(item)))
      if (markAsReadWhenScrolling) {
        changed
          .filter((item) => !item.isViewable)
          .forEach((item) => {
            unreadSyncService.markEntryAsRead(stableIdExtractor(item))
          })
      }

      if (markAsReadWhenRendering) {
        viewableItems
          .filter((item) => item.isViewable)
          .forEach((item) => {
            unreadSyncService.markEntryAsRead(stableIdExtractor(item))
          })
      }
    },
    [markAsReadWhenRendering, markAsReadWhenScrolling, stableIdExtractor],
  )
}
