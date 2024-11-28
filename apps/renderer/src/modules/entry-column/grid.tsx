import { useMobile } from "@follow/components/hooks/useMobile.js"
import { Button } from "@follow/components/ui/button/index.js"
import { useScrollViewElement } from "@follow/components/ui/scroll-area/hooks.js"
import { FeedViewType } from "@follow/constants"
import { useTypeScriptHappyCallback } from "@follow/hooks"
import { LRUCache } from "@follow/utils/lru-cache"
import type { Range, VirtualItem, Virtualizer } from "@tanstack/react-virtual"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { FC } from "react"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { setUISetting, useUISettingKey } from "~/atoms/settings/ui"
import { getEntry } from "~/store/entry"

import { EntryItem } from "./item"
import { PictureMasonry } from "./Items/picture-masonry"
import type { EntryListProps } from "./lists"

export const EntryColumnGrid: FC<EntryListProps> = (props) => {
  const { entriesIds, feedId, hasNextPage, view, fetchNextPage } = props

  const isMobile = useMobile()
  const masonry = useUISettingKey("pictureViewMasonry") || isMobile

  const filterNoImage = useUISettingKey("pictureViewFilterNoImage")
  const nextData = useMemo(() => {
    if (filterNoImage) {
      return entriesIds.filter((entryId) => {
        const entry = getEntry(entryId)
        return entry?.entries.media?.length && entry.entries.media.length > 0
      })
    }
    return entriesIds
  }, [entriesIds, filterNoImage])
  const { t } = useTranslation()
  if (nextData.length === 0 && entriesIds.length > 0) {
    return (
      <div className="center absolute inset-x-0 inset-y-12 -translate-y-12 flex-col gap-5">
        <i className="i-mgc-photo-album-cute-fi size-12" />
        <div className="text-sm text-muted-foreground">
          {t("entry_column.filtered_content_tip")}
        </div>

        <Button
          onClick={() => {
            setUISetting("pictureViewFilterNoImage", false)
          }}
        >
          Show All
        </Button>
      </div>
    )
  }

  const hasFilteredContent = nextData.length < entriesIds.length

  const FilteredContentTip = hasFilteredContent && !hasNextPage && (
    <div className="center mb-6 flex flex-col gap-5">
      <i className="i-mgc-photo-album-cute-fi size-12" />
      <div>{t("entry_column.filtered_content_tip_2")}</div>

      <Button
        onClick={() => {
          setUISetting("pictureViewFilterNoImage", false)
        }}
      >
        Show All
      </Button>
    </div>
  )

  if (masonry && view === FeedViewType.Pictures) {
    return (
      <>
        <PictureMasonry
          key={feedId}
          hasNextPage={hasNextPage}
          endReached={fetchNextPage}
          data={entriesIds}
        />

        {FilteredContentTip}
      </>
    )
  }
  return (
    <>
      <VirtualGrid {...props} />
      {FilteredContentTip}
    </>
  )
}

const capacity = 3 * 2
const offsetCache = new LRUCache<string, number>(capacity)
const measurementsCache = new LRUCache<string, VirtualItem[]>(capacity)

const VirtualGrid: FC<EntryListProps> = (props) => {
  const { entriesIds, feedId, onRangeChange, fetchNextPage, view } = props
  const scrollRef = useScrollViewElement()

  const [containerWidth, setContainerWidth] = useState(0)

  const columns = useMemo(() => {
    if (!scrollRef) return [0]

    const width = containerWidth
    const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    let columnCount = 1 // default (grid-cols-1)
    if (width >= 32 * rem) columnCount = 2 // @lg (32rem)
    if (width >= 48 * rem) columnCount = 3 // @3xl (48rem)
    if (width >= 72 * rem) columnCount = 4 // @6xl (72rem)
    if (width >= 80 * rem) columnCount = 5 // @8xl (80rem)

    return Array.from({ length: columnCount }).fill(width / columnCount) as number[]
  }, [containerWidth, scrollRef])

  // Calculate rows based on entries
  const rows = useMemo(() => {
    const itemsPerRow = columns.length
    const rowCount = Math.ceil(entriesIds.length / itemsPerRow)
    return Array.from({ length: rowCount }, (_, index) =>
      entriesIds.slice(index * itemsPerRow, (index + 1) * itemsPerRow),
    )
  }, [entriesIds, columns.length])

  const rowCacheKey = `${feedId}-row`
  const columnCacheKey = `${feedId}-column`

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => columns[0] + 58,
    overscan: 5,
    getScrollElement: () => scrollRef,
    initialOffset: offsetCache.get(rowCacheKey) ?? 0,
    initialMeasurementsCache: measurementsCache.get(rowCacheKey) ?? [],
    paddingEnd: 32,
    onChange: useTypeScriptHappyCallback(
      (virtualizer: Virtualizer<HTMLElement, Element>) => {
        if (!virtualizer.isScrolling) {
          measurementsCache.put(rowCacheKey, virtualizer.measurementsCache)
          offsetCache.put(rowCacheKey, virtualizer.scrollOffset ?? 0)
        }

        onRangeChange?.(virtualizer.range as Range)
      },
      [rowCacheKey],
    ),
  })

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    getScrollElement: () => scrollRef,
    estimateSize: (i) => columns[i],
    overscan: 5,
    initialOffset: offsetCache.get(columnCacheKey) ?? 0,
    initialMeasurementsCache: measurementsCache.get(columnCacheKey) ?? [],
    onChange: useTypeScriptHappyCallback(
      (virtualizer: Virtualizer<HTMLElement, Element>) => {
        if (!virtualizer.isScrolling) {
          measurementsCache.put(columnCacheKey, virtualizer.measurementsCache)
          offsetCache.put(columnCacheKey, virtualizer.scrollOffset ?? 0)
        }
      },
      [columnCacheKey],
    ),
  })

  useEffect(() => {
    if (!scrollRef) return
    const handler = () => {
      const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      const width = scrollRef.clientWidth - 1 * rem
      setContainerWidth(width)

      rowVirtualizer.measure()
      columnVirtualizer.measure()
    }

    const observer = new ResizeObserver(handler)
    observer.observe(scrollRef)
    return () => {
      observer.disconnect()
    }
  }, [columnVirtualizer, rowVirtualizer, scrollRef])

  useEffect(() => {
    if (!scrollRef) return
    scrollRef.onscrollend = () => {
      fetchNextPage?.()
    }
    return () => {
      scrollRef.onscrollend = null
    }
  }, [fetchNextPage, scrollRef])
  return (
    <div
      className="relative mx-2"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: `${columnVirtualizer.getTotalSize()}px`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <Fragment key={virtualRow.index}>
          {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
            <div
              ref={columnVirtualizer.measureElement}
              key={virtualColumn.index}
              className="absolute left-0 top-0"
              style={{
                height: `${virtualRow.size}px`,
                width: `${virtualColumn.size}px`,

                transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
              }}
            >
              <EntryItem
                entryId={entriesIds[virtualRow.index * columns.length + virtualColumn.index]}
                view={view}
              />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  )
}
