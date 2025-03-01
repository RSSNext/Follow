import type ViewToken from "@shopify/flash-list/dist/viewability/ViewToken"
import { useCallback, useEffect, useInsertionEffect, useMemo, useRef, useState } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"
import { unreadSyncService } from "@/src/store/unread/store"

const defaultIdExtractor = (item: ViewToken) => item.key
export function useOnViewableItemsChanged({
  disabled,
  idExtractor = defaultIdExtractor,
}: {
  disabled?: boolean
  idExtractor?: (item: ViewToken) => string
} = {}) {
  const orientation = useRef<"down" | "up">("down")
  const lastOffset = useRef(0)

  const markAsReadWhenScrolling = useGeneralSettingKey("scrollMarkUnread")
  const markAsReadWhenRendering = useGeneralSettingKey("renderMarkUnread")
  const [lastViewableItems, setLastViewableItems] = useState<ViewToken[] | null>()
  const [lastRemovedItems, setLastRemovedItems] = useState<ViewToken[] | null>(null)

  const [stableIdExtractor] = useState(() => idExtractor)

  const onViewableItemsChanged: (info: {
    viewableItems: ViewToken[]
    changed: ViewToken[]
  }) => void = useNonReactiveCallback(({ viewableItems, changed }) => {
    debouncedFetchEntryContentByStream(viewableItems.map((item) => stableIdExtractor(item)))

    if (orientation.current === "down") {
      setLastViewableItems(viewableItems)
      setLastRemovedItems(changed.filter((item) => !item.isViewable))
    } else {
      setLastRemovedItems(null)
      setLastViewableItems(null)
    }
  })

  useEffect(() => {
    if (!disabled) {
      if (markAsReadWhenScrolling && lastRemovedItems) {
        lastRemovedItems.forEach((item) => {
          unreadSyncService.markEntryAsRead(stableIdExtractor(item))
        })
      }

      if (markAsReadWhenRendering && lastViewableItems) {
        lastViewableItems.forEach((item) => {
          unreadSyncService.markEntryAsRead(stableIdExtractor(item))
        })
      }
    }
  }, [
    disabled,
    lastRemovedItems,
    lastViewableItems,
    markAsReadWhenRendering,
    markAsReadWhenScrolling,
    stableIdExtractor,
  ])

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = e.nativeEvent.contentOffset.y
    const currentOrientation = currentOffset > lastOffset.current ? "down" : "up"
    orientation.current = currentOrientation
    lastOffset.current = currentOffset
  }, [])

  return useMemo(() => ({ onViewableItemsChanged, onScroll }), [onScroll, onViewableItemsChanged])
}

function useNonReactiveCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn)
  useInsertionEffect(() => {
    ref.current = fn
  }, [fn])
  return useCallback(
    (...args: any) => {
      const latestFn = ref.current
      return latestFn(...args)
    },
    [ref],
  ) as unknown as T
}
