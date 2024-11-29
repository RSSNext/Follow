import { useMobile } from "@follow/components/hooks/useMobile.js"
import { Button } from "@follow/components/ui/button/index.js"
import { useScrollViewElement } from "@follow/components/ui/scroll-area/hooks.js"
import { FeedViewType } from "@follow/constants"
import { useTypeScriptHappyCallback } from "@follow/hooks"
import { LRUCache } from "@follow/utils/lru-cache"
import type { Range, VirtualItem, Virtualizer } from "@tanstack/react-virtual"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { FC } from "react"
import { Fragment, startTransition, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { setUISetting, useUISettingKey } from "~/atoms/settings/ui"
import { getEntry } from "~/store/entry"

import { EntryItem, EntryItemSkeleton } from "./item"
import { PictureMasonry } from "./Items/picture-masonry"
import type { EntryListProps } from "./list"

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

const ratioMap = {
  [FeedViewType.Pictures]: 1,
  //  16:9
  [FeedViewType.Videos]: 16 / 9,
}
const VirtualGrid: FC<EntryListProps> = (props) => {
  const { entriesIds, feedId, onRangeChange, fetchNextPage, view, Footer, hasNextPage, listRef } =
    props
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

  const rowVirtualizer = useVirtualizer({
    count: rows.length + 1,
    estimateSize: () => {
      return columns[0] / ratioMap[view] + 58
    },
    overscan: 5,
    gap: 8,
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

        if (!virtualizer.range) return

        const columnCount = columns.length
        const realRange = {
          startIndex: virtualizer.range.startIndex * columnCount,
          endIndex: virtualizer.range.endIndex * columnCount,
        }

        onRangeChange?.(realRange as Range)
      },
      [rowCacheKey, columns.length],
    ),
  })

  useEffect(() => {
    if (!listRef) return
    listRef.current = rowVirtualizer
  }, [rowVirtualizer, listRef])

  useEffect(() => {
    if (!scrollRef) return
    const handler = () => {
      const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      const width = scrollRef.clientWidth - 2 * rem
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

  const virtualItems = rowVirtualizer.getVirtualItems()
  useEffect(() => {
    const lastItem = virtualItems.at(-1)

    if (!lastItem) {
      return
    }

    const isPlaceholderRow = lastItem.index === rows.length

    if (isPlaceholderRow && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, rows.length, virtualItems])

  const [ready, setReady] = useState(false)

  useEffect(() => {
    startTransition(() => {
      setReady(true)
    })
  }, [])

  return (
    <div
      className="relative mx-4"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: `${columnVirtualizer.getTotalSize()}px`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const isLoaderRow = virtualRow.key === rows.length
        if (isLoaderRow && ready) {
          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {Footer ? typeof Footer === "function" ? <Footer /> : Footer : null}
              {hasNextPage && <EntryItemSkeleton view={view} count={6} />}
            </div>
          )
        }
        return (
          <Fragment key={virtualRow.key}>
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
                {ready && (
                  <EntryItem
                    entryId={entriesIds[virtualRow.index * columns.length + virtualColumn.index]}
                    view={view}
                  />
                )}
              </div>
            ))}
          </Fragment>
        )
      })}
    </div>
  )
}
