import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid"
import { useScrollViewElement } from "@renderer/components/ui/scroll-area/hooks"
import { useRefValue } from "@renderer/hooks/common"
import { FeedViewType } from "@renderer/lib/enum"
import { throttle } from "lodash-es"
import type { CSSProperties, PropsWithChildren } from "react"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import { EntryItemSkeleton } from "./item"
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

export const PictureMasonry = ({
  data,
  endReached,
  hasNextPage,
}: {
  data: string[]
  endReached: () => Promise<any>
  hasNextPage: boolean
}) => {
  const masonryRef = useRef<MasonryInfiniteGrid>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentItemWidth, setCurrentItemWidth] = useState(0)
  const [currentColumn, setCurrentColumn] = useState(1)
  const $scroll = useScrollViewElement()

  const currentScrollDirectionRef = useRef<"up" | "down">("down")
  const loadDataCallOnceRef = useRef(false)

  const stableEndReached = useRefValue(endReached)
  const escapedHasNextPageRef = useRefValue(hasNextPage)
  useLayoutEffect(() => {
    if (!$scroll) return

    let lastScrollTop = 0
    const scrollHandler = () => {
      if (!escapedHasNextPageRef.current) return
      const currentScrollTop = $scroll.scrollTop
      const scrollDirection = currentScrollTop > lastScrollTop ? "down" : "up"
      lastScrollTop = currentScrollTop
      currentScrollDirectionRef.current = scrollDirection
      const threshold = 100

      const isAtTop = currentScrollTop <= threshold
      const { scrollHeight } = $scroll
      const isReachBottom =
        currentScrollTop + scrollHeight >= scrollHeight - threshold

      if (!isReachBottom || isAtTop) return

      if (loadDataCallOnceRef.current) return
      if (currentScrollDirectionRef.current === "down") {
        // load more data
        loadDataCallOnceRef.current = true

        stableEndReached.current().finally(() => {
          loadDataCallOnceRef.current = false
        })
      }
    }
    $scroll.addEventListener("scroll", scrollHandler)

    return () => {
      $scroll.removeEventListener("scroll", scrollHandler)
    }
  }, [$scroll, escapedHasNextPageRef, stableEndReached])

  useLayoutEffect(() => {
    const $warpper = containerRef.current
    if (!$warpper) return
    const recal = throttle(() => {
      const column = getCurrentColumn($warpper.clientWidth)
      setCurrentItemWidth($warpper.clientWidth / column - 20)

      setCurrentColumn(column)
    }, 50)
    const resizeObserver = new ResizeObserver(() => {
      recal()
    })
    recal()
    resizeObserver.observe($warpper)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const masonry = masonryRef.current
    if (!$scroll) return
    if (!masonry) return
    const $container = masonry.getContainerElement()
    if (!$container) return
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement

          const item = target.childNodes.item(0) as HTMLElement

          if (entry.isIntersecting) {
            target.style.height = ""

            item.style.display = ""
          } else {
            target.style.height = `${item.clientHeight}px`
            item.style.display = "none"
          }
        }
      },
      {
        root: $scroll,
        rootMargin: "250px",
      },
    )

    for (const node of $container.childNodes.values()) {
      intersectionObserver.observe(node as HTMLElement)
    }

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes.values()) {
            intersectionObserver.observe(node as HTMLElement)
          }
        }
      }
    })
    mutationObserver.observe($container, {
      childList: true,
    })

    return () => {
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [$scroll])

  const itemStyle: CSSProperties = useMemo(
    () => ({ width: currentItemWidth }),
    [currentItemWidth],
  )

  const loadingSkeletonItem = hasNextPage && (
    <LoadingSkeletonItem itemStyle={itemStyle} />
  )
  return (
    <div ref={containerRef} className="p-4">
      <MasonryInfiniteGrid
        ref={masonryRef}
        useResizeObserver
        gap={{ vertical: 24 }}
        column={currentColumn}
      >
        {data.map((entryId) => (
          <VirtualItemWrapper itemStyle={itemStyle} key={entryId}>
            <PictureWaterFallItem entryId={entryId} />
          </VirtualItemWrapper>
        ))}

        {loadingSkeletonItem}
        {loadingSkeletonItem}
        {loadingSkeletonItem}
        {loadingSkeletonItem}
        {loadingSkeletonItem}
        {loadingSkeletonItem}
        {loadingSkeletonItem}
        {loadingSkeletonItem}
      </MasonryInfiniteGrid>
    </div>
  )
}

const LoadingSkeletonItem = ({ itemStyle }: { itemStyle: CSSProperties }) => (
  <div style={itemStyle}>
    <EntryItemSkeleton single view={FeedViewType.Pictures} />
  </div>
)

const VirtualItemWrapper = ({
  itemStyle,
  style,
  children,
  ...rest
}: {
  itemStyle: CSSProperties
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
