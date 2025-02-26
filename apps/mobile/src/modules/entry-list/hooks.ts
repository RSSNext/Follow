import type ViewToken from "@shopify/flash-list/dist/viewability/ViewToken"
import { useMemo, useRef, useState } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"
import { unreadSyncService } from "@/src/store/unread/store"

const defaultIdExtractor = (item: ViewToken) => item.key
export function useOnViewableItemsChanged({
  idExtractor = defaultIdExtractor,
  disabled,
}: {
  disabled?: boolean
  idExtractor?: (item: ViewToken) => string
} = {}): {
  onViewableItemsChanged: (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
} {
  const orientation = useRef<"down" | "up">("down")
  const lastOffset = useRef(0)

  const markAsReadWhenScrolling = useGeneralSettingKey("scrollMarkUnread")
  const markAsReadWhenRendering = useGeneralSettingKey("renderMarkUnread")

  const [stableIdExtractor] = useState(() => idExtractor)

  return useMemo(() => {
    return {
      onViewableItemsChanged: ({ viewableItems, changed }) => {
        if (disabled) return

        debouncedFetchEntryContentByStream(viewableItems.map((item) => stableIdExtractor(item)))
        if (markAsReadWhenScrolling && orientation.current === "down") {
          changed
            .filter((item) => !item.isViewable)
            .forEach((item) => {
              unreadSyncService.markEntryAsRead(stableIdExtractor(item))
            })
        }

        if (markAsReadWhenRendering && orientation.current === "down") {
          viewableItems
            .filter((item) => item.isViewable)
            .forEach((item) => {
              unreadSyncService.markEntryAsRead(stableIdExtractor(item))
            })
        }
      },
      onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = e.nativeEvent.contentOffset.y
        const currentOrientation = currentOffset > lastOffset.current ? "down" : "up"
        orientation.current = currentOrientation
        lastOffset.current = currentOffset
      },
    }
  }, [disabled, markAsReadWhenRendering, markAsReadWhenScrolling, orientation, stableIdExtractor])
}
