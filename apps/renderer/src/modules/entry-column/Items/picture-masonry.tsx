import { useSingleton } from "foxact/use-singleton"
import { throttle } from "lodash-es"
import type { RenderComponentProps } from "masonic"
import { useInfiniteLoader } from "masonic"
import type { FC } from "react"
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

import { Masonry } from "~/components/ui/Masonry"
import { useScrollViewElement } from "~/components/ui/scroll-area/hooks"
import { nextFrame } from "~/lib/dom"
import { FeedViewType } from "~/lib/enum"
import { getEntry } from "~/store/entry"
import { imageActions } from "~/store/image"

import { batchMarkRead } from "../hooks"
import { EntryItemSkeleton } from "../item"
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

const MemoedMasonry = memo(Masonry)
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

    // if (props.hasNextPage) {
    //   for (let i = 0; i < 10; i++) {
    //     result.push({
    //       entryId: "placeholder",
    //     })
    //   }
    // }

    return result
  }, [data, props.hasNextPage])

  const [masonryItemsRadio, setMasonryItemsRadio] = useState<Record<string, number>>({})
  const maybeLoadMore = useInfiniteLoader(props.endReached, {
    isItemLoaded: (index, items) => !!items[index],
    minimumBatchSize: 32,
    threshold: 3,
  })

  const scrollElement = useScrollViewElement()

  const [intersectionObserver, setIntersectionObserver] = useState<IntersectionObserver>(null!)
  useEffect(() => {
    if (!scrollElement) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entryIds: string[] = []
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5) {
            entryIds.push((entry.target as HTMLDivElement).dataset.entryId as string)
          }
        })

        batchMarkRead(entryIds)
      },
      {
        rootMargin: "0px",
        threshold: 1,
        root: scrollElement,
      },
    )
    setIntersectionObserver(observer)
    return () => {
      observer.disconnect()
    }
  }, [scrollElement])

  return (
    <div ref={containerRef} className="p-4">
      {isInitDim && isInitLayout && (
        <MasonryItemWidthContext.Provider value={currentItemWidth}>
          <MasonryItemsAspectRatioContext.Provider value={masonryItemsRadio}>
            <MasonryItemsAspectRatioSetterContext.Provider value={setMasonryItemsRadio}>
              <MasonryIntersectionContext.Provider value={intersectionObserver}>
                <MemoedMasonry
                  items={items}
                  columnGutter={gutter}
                  columnWidth={currentItemWidth}
                  columnCount={currentColumn}
                  overscanBy={3}
                  render={render}
                  onRender={maybeLoadMore}
                  itemKey={itemKey as (data: unknown, index: number) => string | number}
                />
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
> = ({ data }) => {
  if (data.entryId === "placeholder") {
    return <LoadingSkeletonItem />
  }
  return <PictureWaterFallItem entryId={data.entryId} />
}
interface MasonryProps {
  data: string[]
  endReached: () => Promise<any>
  hasNextPage: boolean
}

const LoadingSkeletonItem = () => <EntryItemSkeleton count={1} view={FeedViewType.Pictures} />
