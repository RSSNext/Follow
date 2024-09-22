import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid"
import { debounce, throttle } from "lodash-es"
import type { CSSProperties, FC, PropsWithChildren } from "react"
import { memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { useScrollViewElement } from "~/components/ui/scroll-area/hooks"
import { nextFrame } from "~/lib/dom"
import { FeedViewType } from "~/lib/enum"
import { getEntry } from "~/store/entry"
import { imageActions } from "~/store/image"

import { batchMarkRead } from "../hooks"
import { EntryItemSkeleton } from "../item"
import {
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

export const PictureMasonry: FC<MasonryProps> = (props) => {
  const { data } = props
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
      setCurrentItemWidth(Math.trunc($warpper.clientWidth / column - 20))

      setCurrentColumn(column)

      nextFrame(() => {
        setIsInitLayout(true)
      })
    }
    const recal = throttle(handler, 50)

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

  return (
    <div ref={containerRef} className="p-4">
      <MasonryItemWidthContext.Provider value={currentItemWidth}>
        {isInitDim && isInitLayout && (
          <PictureMasonryImpl
            {...props}
            column={currentColumn}
            restoreDimensions={restoreDimensions}
          />
        )}
      </MasonryItemWidthContext.Provider>
    </div>
  )
}
interface MasonryProps {
  data: string[]
  endReached: () => Promise<any>
  hasNextPage: boolean
}

const PictureMasonryImpl = ({
  data,
  endReached,
  hasNextPage,
  restoreDimensions,
  column,
}: MasonryProps & {
  restoreDimensions: () => Promise<void>
  column: number
}) => {
  const masonryRef = useRef<MasonryInfiniteGrid>(null)

  const $scroll = useScrollViewElement()
  const currentItemWidth = useContext(MasonryItemWidthContext)
  const itemStyle: CSSProperties = useMemo(() => ({ width: currentItemWidth }), [currentItemWidth])

  const [masonryItemsRadio, setMasonryItemsRadio] = useState<Record<string, number>>({})

  const scrollMarkUnread = useGeneralSettingKey("scrollMarkUnread")
  const inViewMarkRead = useGeneralSettingKey("renderMarkUnread")
  const handleScroll = useEventCallback(
    debounce(() => {
      if (!scrollMarkUnread) return
      const $masonryRef = masonryRef.current
      if (!$masonryRef) return
      const items = $masonryRef.getVisibleItems()

      const first = items[0]
      if (!first) return
      const itemIndex = first.element?.dataset.index
      if (itemIndex === undefined) return
      const prevIndex = +itemIndex - 1
      if (Number.isNaN(prevIndex)) return
      if (prevIndex < 0) return
      const markReadIdsSlice = data.slice(0, prevIndex + 1)

      batchMarkRead(markReadIdsSlice)
    }, 100),
  )

  return (
    <MasonryItemsAspectRatioContext.Provider value={masonryItemsRadio}>
      <MasonryItemsAspectRatioSetterContext.Provider value={setMasonryItemsRadio}>
        <MasonryInfiniteGrid
          ref={masonryRef}
          onRenderComplete={useEventCallback((e) => {
            if (!inViewMarkRead) {
              return
            }
            const entryIds: string[] = []
            for (const mount of e.mounted) {
              const index = +(mount.element?.dataset.index as string)
              if (Number.isNaN(index)) return
              const entryId = data[index]

              if (!entryId) continue
              entryIds.push(entryId)
            }
            batchMarkRead(entryIds)
          })}
          placeholder={<LoadingSkeletonItem itemStyle={itemStyle} />}
          onRequestAppend={(e) => {
            if (!hasNextPage) return
            e.wait()
            const nextGroupKey = (+e.groupKey! || 0) + 1
            e.currentTarget.appendPlaceholders(10, nextGroupKey)
            endReached()
              .then(restoreDimensions)
              .finally(() => {
                e.ready()
              })
          }}
          onChangeScroll={handleScroll}
          scrollContainer={$scroll}
          gap={{ vertical: 24 }}
          column={column}
        >
          {data.map((entryId, index) => (
            <ItemWrapper
              data-grid-groupkey={(index / 5) | 0}
              data-index={index}
              itemStyle={itemStyle}
              key={entryId}
              entryId={entryId}
            >
              <PictureWaterFallItem entryId={entryId} />
            </ItemWrapper>
          ))}
        </MasonryInfiniteGrid>
      </MasonryItemsAspectRatioSetterContext.Provider>
    </MasonryItemsAspectRatioContext.Provider>
  )
}

const LoadingSkeletonItem = ({ itemStyle }: { itemStyle: CSSProperties }) => (
  <div style={itemStyle}>
    <EntryItemSkeleton count={1} view={FeedViewType.Pictures} />
  </div>
)

const ItemWrapperImpl = ({
  itemStyle,
  style,
  children,
  entryId,
  ...rest
}: {
  itemStyle: CSSProperties
  entryId: string
} & React.HtmlHTMLAttributes<HTMLDivElement> &
  PropsWithChildren) => (
  <div
    style={{
      ...style,
      ...itemStyle,
    }}
    {...rest}
  >
    {children}
  </div>
)

const ItemWrapper = memo(ItemWrapperImpl)
