import { Masonry } from "@follow/components/ui/masonry/index.js"
import { useScrollViewElement } from "@follow/components/ui/scroll-area/hooks.js"
import { Skeleton } from "@follow/components/ui/skeleton/index.jsx"
import { useRefValue } from "@follow/hooks"
import { nextFrame } from "@follow/utils/dom"
import { useSingleton } from "foxact/use-singleton"
import { throttle } from "lodash-es"
import type { RenderComponentProps } from "masonic"
import { useInfiniteLoader } from "masonic"
import type { FC } from "react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { MediaContainerWidthProvider } from "~/components/ui/media"
import { getEntry } from "~/store/entry"
import { imageActions } from "~/store/image"

import { batchMarkRead } from "../hooks"
import {
  MasonryIntersectionContext,
  MasonryItemsAspectRatioContext,
  MasonryItemsAspectRatioSetterContext,
  MasonryItemWidthContext,
} from "./contexts/picture-masonry-context"
import { PictureWaterFallItem } from "./picture-item"

// grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 @7xl:grid-cols-5 px-4 gap-1.5

const breakpoints = {
  0: 1,
  // 32rem => 32 * 16= 512
  512: 2,
  // 48rem => 48 * 16= 768
  768: 3,
  // 72rem => 72 * 16= 1152
  1152: 4,
  // 80rem => 80 * 16= 1280
  1280: 5,
  1536: 6,
  1792: 7,
  2048: 8,
}
const getCurrentColumn = (w: number) => {
  // Initialize column count with the minimum number of columns
  let columns = 1

  // Iterate through each breakpoint and determine the column count
  for (const [breakpoint, cols] of Object.entries(breakpoints)) {
    if (w >= Number.parseInt(breakpoint)) {
      columns = cols
    } else {
      break
    }
  }

  return columns
}
const gutter = 24

export const PictureMasonry: FC<MasonryProps> = (props) => {
  const { data } = props
  const cacheMap = useSingleton(() => new Map<string, object>()).current
  const [isInitDim, setIsInitDim] = useState(false)
  const [isInitLayout, setIsInitLayout] = useState(false)
  const [currentItemWidth, setCurrentItemWidth] = useState(0)
  const restoreDimensions = useEventCallback(async () => {
    const images = [] as string[]
    data.forEach((entryId) => {
      const entry = getEntry(entryId)
      if (!entry) return

      images.push(...imageActions.getImagesFromEntry(entry.entries))
    })
    return imageActions.fetchDimensionsFromDb(images)
  })
  useEffect(() => {
    restoreDimensions().finally(() => {
      setIsInitDim(true)
    })
  }, [])
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentColumn, setCurrentColumn] = useState(1)

  useLayoutEffect(() => {
    const $warpper = containerRef.current
    if (!$warpper) return
    const handler = () => {
      const column = getCurrentColumn($warpper.clientWidth)
      setCurrentItemWidth(Math.trunc($warpper.clientWidth / column - gutter))

      setCurrentColumn(column)

      nextFrame(() => {
        setIsInitLayout(true)
      })
    }
    const recal = throttle(handler, 1000 / 12)

    let previousWidth = $warpper.offsetWidth
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width

        if (newWidth !== previousWidth) {
          previousWidth = newWidth

          recal()
        }
      }
    })
    recal()
    resizeObserver.observe($warpper)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const items = useMemo(() => {
    const result = data.map((entryId) => {
      const cache = cacheMap.get(entryId)
      if (cache) {
        return cache
      }

      const ret = { entryId }
      cacheMap.set(entryId, ret)
      return ret
    }) as { entryId: string; cache?: object }[]

    if (props.hasNextPage) {
      for (let i = 0; i < 10; i++) {
        result.push({
          entryId: `placeholder${i}`,
        })
      }
    }

    return result
  }, [cacheMap, data, props.hasNextPage])

  const [masonryItemsRadio, setMasonryItemsRadio] = useState<Record<string, number>>({})
  const maybeLoadMore = useInfiniteLoader(props.endReached, {
    isItemLoaded: (index, items) => !!items[index],
    minimumBatchSize: 32,
    threshold: 3,
  })

  const currentRange = useRef<{ start: number; end: number }>()
  const handleRender = useCallback(
    (startIndex: number, stopIndex: number, items: any[]) => {
      currentRange.current = { start: startIndex, end: stopIndex }
      return maybeLoadMore(startIndex, stopIndex, items)
    },
    [maybeLoadMore],
  )
  const scrollElement = useScrollViewElement()

  const [intersectionObserver, setIntersectionObserver] = useState<IntersectionObserver>(null!)
  const renderMarkRead = useGeneralSettingKey("renderMarkUnread")
  const scrollMarkRead = useGeneralSettingKey("scrollMarkUnread")

  const dataRef = useRefValue(data)
  useEffect(() => {
    if (!renderMarkRead && !scrollMarkRead) return
    if (!scrollElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        renderInViewMarkRead(entries)
        scrollOutViewMarkRead(entries)

        function scrollOutViewMarkRead(entries: IntersectionObserverEntry[]) {
          if (!scrollMarkRead) return
          if (!scrollElement) return
          let minimumIndex = Number.MAX_SAFE_INTEGER
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              return
            }
            const $target = entry.target as HTMLDivElement
            const $targetScrollTop = $target.getBoundingClientRect().top

            if ($targetScrollTop < 0) {
              const { index } = (entry.target as HTMLDivElement).dataset
              if (!index) return
              const currentIndex = Number.parseInt(index)
              // if index is 0, or not a number, then skip
              if (!currentIndex) return
              // It is possible that the end coordinates beyond the overscan range are still being calculated and the position is not actually determined. Filtering here
              if (currentIndex > (currentRange.current?.end ?? 0)) {
                return
              }

              minimumIndex = Math.min(minimumIndex, currentIndex)
            }
          })

          if (minimumIndex !== Number.MAX_SAFE_INTEGER) {
            batchMarkRead(dataRef.current.slice(0, minimumIndex))
          }
        }

        function renderInViewMarkRead(entries: IntersectionObserverEntry[]) {
          if (!renderMarkRead) return
          const entryIds: string[] = []
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.8 &&
              entry.boundingClientRect.top >= entry.rootBounds!.top
            ) {
              entryIds.push((entry.target as HTMLDivElement).dataset.entryId as string)
            }
          })

          batchMarkRead(entryIds)
        }
      },
      {
        rootMargin: "0px",
        threshold: [0, 1],
        root: scrollElement,
      },
    )
    setIntersectionObserver(observer)
    return () => {
      observer.disconnect()
    }
  }, [scrollElement, renderMarkRead, scrollMarkRead, dataRef])

  return (
    <div ref={containerRef} className="p-4">
      {isInitDim && isInitLayout && (
        <MasonryItemWidthContext.Provider value={currentItemWidth}>
          <MasonryItemsAspectRatioContext.Provider value={masonryItemsRadio}>
            <MasonryItemsAspectRatioSetterContext.Provider value={setMasonryItemsRadio}>
              <MasonryIntersectionContext.Provider value={intersectionObserver}>
                <MediaContainerWidthProvider width={currentItemWidth}>
                  <Masonry
                    items={items}
                    columnGutter={gutter}
                    columnWidth={currentItemWidth}
                    columnCount={currentColumn}
                    overscanBy={2}
                    render={render}
                    onRender={handleRender}
                    itemKey={itemKey}
                  />
                </MediaContainerWidthProvider>
              </MasonryIntersectionContext.Provider>
            </MasonryItemsAspectRatioSetterContext.Provider>
          </MasonryItemsAspectRatioContext.Provider>
        </MasonryItemWidthContext.Provider>
      )}
    </div>
  )
}

const itemKey = (item: { entryId: string }) => item.entryId
const render: React.ComponentType<
  RenderComponentProps<{
    entryId: string
  }>
> = ({ data, index }) => {
  if (data.entryId.startsWith("placeholder")) {
    return <LoadingSkeletonItem />
  }

  return <PictureWaterFallItem entryId={data.entryId} index={index} />
}
interface MasonryProps {
  data: string[]
  endReached: () => Promise<any>
  hasNextPage: boolean
}

const LoadingSkeletonItem = () => {
  // random height, between 100-400px
  const randomHeight = useSingleton(() => Math.random() * 300 + 100).current
  return (
    <div className="relative flex gap-2 overflow-x-auto">
      <div
        className="relative flex w-full shrink-0 items-center overflow-hidden rounded-md"
        style={{ height: `${randomHeight}px` }}
      >
        <Skeleton className="size-full overflow-hidden" />
      </div>
    </div>
  )
}
