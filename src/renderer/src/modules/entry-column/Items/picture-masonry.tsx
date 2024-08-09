import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid"
import { useScrollViewElement } from "@renderer/components/ui/scroll-area/hooks"
import { FeedViewType } from "@renderer/lib/enum"
import { getEntry } from "@renderer/store/entry"
import { imageActions } from "@renderer/store/image"
import { throttle } from "lodash-es"
import type { CSSProperties, FC, PropsWithChildren } from "react"
import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"

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
  const [isInit, setIsInit] = useState(false)

  const restoreDimensions = useEventCallback(async () => {
    const images = [] as string[]
    data.forEach((entryId) => {
      const entry = getEntry(entryId)

      images.push(...imageActions.getImagesFromEntry(entry.entries))
    })
    return imageActions.fetchDimensionsFromDb(images)
  })
  useEffect(() => {
    restoreDimensions().finally(() => {
      setIsInit(true)
    })
  }, [])

  if (!isInit) return null

  return (
    <PictureMasonryImpl {...props} restoreDimensions={restoreDimensions} />
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
}: MasonryProps & { restoreDimensions: () => Promise<void> }) => {
  const masonryRef = useRef<MasonryInfiniteGrid>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentItemWidth, setCurrentItemWidth] = useState(0)
  const [currentColumn, setCurrentColumn] = useState(1)
  const $scroll = useScrollViewElement()

  useLayoutEffect(() => {
    const $warpper = containerRef.current
    if (!$warpper) return
    const recal = throttle(() => {
      const column = getCurrentColumn($warpper.clientWidth)
      setCurrentItemWidth(Math.trunc($warpper.clientWidth / column - 20))

      setCurrentColumn(column)

      masonryRef.current?.renderItems()
    }, 50)

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

  const itemStyle: CSSProperties = useMemo(
    () => ({ width: currentItemWidth }),
    [currentItemWidth],
  )

  const [masonryItemsRadio, setMasonryItemsRadio] = useState<
    Record<string, number>
  >({})

  return (
    <div ref={containerRef} className="p-4">
      <MasonryItemsAspectRatioContext.Provider value={masonryItemsRadio}>
        <MasonryItemWidthContext.Provider value={currentItemWidth}>
          <MasonryItemsAspectRatioSetterContext.Provider
            value={setMasonryItemsRadio}
          >
            <MasonryInfiniteGrid
              ref={masonryRef}
              placeholder={<LoadingSkeletonItem itemStyle={itemStyle} />}
              onRequestAppend={(e) => {
                if (!hasNextPage) return
                e.wait()
                const nextGroupKey = (+e.groupKey! || 0) + 1
                e.currentTarget.appendPlaceholders(10, nextGroupKey)
                endReached()
                  .then(restoreDimensions).finally(() => {
                    e.ready()
                  })
              }}
              scrollContainer={$scroll}
              observeChildren
              useFirstRender
              gap={{ vertical: 24 }}
              column={currentColumn}
            >
              {data.map((entryId, index) => (
                <ItemWrapper
                  data-grid-groupkey={index}
                  itemStyle={itemStyle}
                  key={entryId}
                  entryId={entryId}
                >
                  <PictureWaterFallItem entryId={entryId} />
                </ItemWrapper>
              ))}
            </MasonryInfiniteGrid>
          </MasonryItemsAspectRatioSetterContext.Provider>
        </MasonryItemWidthContext.Provider>
      </MasonryItemsAspectRatioContext.Provider>
    </div>
  )
}

const LoadingSkeletonItem = ({ itemStyle }: { itemStyle: CSSProperties }) => (
  <div style={itemStyle}>
    <EntryItemSkeleton single view={FeedViewType.Pictures} />
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
