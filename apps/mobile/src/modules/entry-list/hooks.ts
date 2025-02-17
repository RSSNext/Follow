import type ViewToken from "@shopify/flash-list/dist/viewability/ViewToken"
import { useCallback } from "react"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"
import { unreadSyncService } from "@/src/store/unread/store"

export function useOnViewableItemsChanged(): (info: {
  viewableItems: ViewToken[]
  changed: ViewToken[]
}) => void {
  const markAsReadWhenScrolling = useGeneralSettingKey("scrollMarkUnread")

  return useCallback(
    ({ viewableItems, changed }) => {
      debouncedFetchEntryContentByStream(viewableItems.map((item) => item.key))
      if (markAsReadWhenScrolling) {
        changed
          .filter((item) => !item.isViewable)
          .forEach((item) => {
            unreadSyncService.markEntryAsRead(item.key)
          })
      }
    },
    [markAsReadWhenScrolling],
  )
}
