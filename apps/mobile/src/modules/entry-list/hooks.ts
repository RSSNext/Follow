import type ViewToken from "@shopify/flash-list/dist/viewability/ViewToken"
import { useCallback, useInsertionEffect, useMemo, useRef, useState } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"
import { unreadSyncService } from "@/src/store/unread/store"

const defaultIdExtractor = (item: ViewToken) => item.key
export function useOnViewableItemsChanged({
  idExtractor = defaultIdExtractor,
}: {
  idExtractor?: (item: ViewToken) => string
} = {}) {
  const orientation = useRef<"down" | "up" | "initial">("initial")
  const lastOffset = useRef(0)

  const markAsReadWhenScrolling = useGeneralSettingKey("scrollMarkUnread")
  const markAsReadWhenRendering = useGeneralSettingKey("renderMarkUnread")

  const [stableIdExtractor] = useState(() => idExtractor)

  const onViewableItemsChanged: (info: {
    viewableItems: ViewToken[]
    changed: ViewToken[]
  }) => void = useNonReactiveCallback(({ viewableItems, changed }) => {
    debouncedFetchEntryContentByStream(viewableItems.map((item) => stableIdExtractor(item)))

    if (orientation.current !== "down") return

    if (markAsReadWhenScrolling) {
      changed
        .filter((item) => !item.isViewable)
        .forEach((item) => {
          unreadSyncService.markEntryAsRead(stableIdExtractor(item))
        })
    }

    if (markAsReadWhenRendering) {
      viewableItems.forEach((item) => {
        unreadSyncService.markEntryAsRead(stableIdExtractor(item))
      })
    }
  })

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
