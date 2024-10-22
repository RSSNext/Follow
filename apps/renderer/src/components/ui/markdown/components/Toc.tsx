import { getViewport, useViewport } from "@follow/components/hooks/useViewport.js"
import { useScrollViewElement } from "@follow/components/ui/scroll-area/hooks.js"
import { getElementTop } from "@follow/utils/dom"
import { springScrollToElement } from "@follow/utils/scroller"
import { cn } from "@follow/utils/utils"
import * as HoverCard from "@radix-ui/react-hover-card"
import { AnimatePresence, m } from "framer-motion"
import { throttle } from "lodash-es"
import {
  memo,
  startTransition,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"

import { useUISettingKey } from "~/atoms/settings/ui"
import {
  useGetWrappedElementPosition,
  useWrappedElementPosition,
  useWrappedElementSize,
} from "~/providers/wrapped-element-provider"

import { MarkdownRenderContainerRefContext } from "../context"
import type { TocItemProps } from "./TocItem"
import { TocItem } from "./TocItem"

type DebouncedFuncLeading<T extends (..._args: any[]) => any> = T & {
  cancel: () => void
  flush: () => void
}
export interface ITocItem {
  depth: number
  title: string
  anchorId: string
  index: number

  $heading: HTMLHeadingElement
}

const WiderTocStyle = {
  width: 200,
} satisfies React.CSSProperties
export const Toc: Component = ({ className }) => {
  const markdownElement = useContext(MarkdownRenderContainerRefContext)
  const { toc, rootDepth } = useTocItems(markdownElement)
  const { currentScrollRange, handleScrollTo } = useScrollTracking(toc)

  const renderContentElementPosition = useWrappedElementPosition()
  const renderContentElementSize = useWrappedElementSize()
  const entryContentInWideMode = useUISettingKey("wideMode")
  const shouldShowTitle = useViewport((v) => {
    if (!entryContentInWideMode) return false
    const { w } = v
    const xAxis = renderContentElementPosition.x + renderContentElementSize.w

    return w - xAxis > WiderTocStyle.width + 50
  })

  if (toc.length === 0) return null

  return shouldShowTitle ? (
    <TocContainer
      className={className}
      toc={toc}
      rootDepth={rootDepth}
      currentScrollRange={currentScrollRange}
      handleScrollTo={handleScrollTo}
    />
  ) : (
    <TocHoverCard
      className={className}
      toc={toc}
      rootDepth={rootDepth}
      currentScrollRange={currentScrollRange}
      handleScrollTo={handleScrollTo}
    />
  )
}

const TocContainer: React.FC<TocContainerProps> = ({
  className,
  toc,
  rootDepth,
  currentScrollRange,
  handleScrollTo,
}) => {
  return (
    <div
      className={cn(
        "group relative overflow-auto opacity-60 duration-200 scrollbar-none group-hover:opacity-100",
        "flex flex-col",
        className,
      )}
      style={WiderTocStyle}
    >
      {toc.map((heading, index) => (
        <MemoedItem
          variant="title-line"
          heading={heading}
          key={heading.anchorId}
          rootDepth={rootDepth}
          onClick={handleScrollTo}
          isScrollOut={index < currentScrollRange[0]}
          range={index === currentScrollRange[0] ? currentScrollRange[1] : 0}
        />
      ))}
    </div>
  )
}

const TocHoverCard: React.FC<TocHoverCardProps> = ({
  className,
  toc,
  rootDepth,
  currentScrollRange,
  handleScrollTo,
}) => {
  const [hoverShow, setHoverShow] = useState(false)

  return (
    <div className="flex grow flex-col scroll-smooth px-2 scrollbar-none">
      <HoverCard.Root openDelay={100} open={hoverShow} onOpenChange={setHoverShow}>
        <HoverCard.Trigger asChild>
          <div
            className={cn(
              "group overflow-auto opacity-60 duration-200 scrollbar-none group-hover:opacity-100",
              className,
            )}
          >
            {toc.map((heading, index) => (
              <MemoedItem
                heading={heading}
                key={heading.anchorId}
                rootDepth={rootDepth}
                onClick={handleScrollTo}
                isScrollOut={index < currentScrollRange[0]}
                range={index === currentScrollRange[0] ? currentScrollRange[1] : 0}
              />
            ))}
          </div>
        </HoverCard.Trigger>
        <HoverCard.Portal forceMount>
          <div>
            <AnimatePresence>
              {hoverShow && (
                <HoverCard.Content side="left" align="start" asChild>
                  <m.ul
                    initial={{ opacity: 0, x: 110 }}
                    animate={{ opacity: 1, x: 100 }}
                    exit={{ opacity: 0, x: 110, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className={cn(
                      "relative z-10 -mt-1 rounded-xl border bg-white px-3 py-1 text-xs drop-shadow-xl dark:bg-neutral-950",
                      "max-h-[calc(100svh-4rem)] overflow-auto scrollbar-none",
                    )}
                  >
                    {toc.map((heading, index) => (
                      <li
                        key={heading.anchorId}
                        className="flex w-full items-center"
                        style={{ paddingLeft: `${(heading.depth - rootDepth) * 12}px` }}
                      >
                        <button
                          className={cn(
                            "group flex w-full cursor-pointer justify-between py-1",
                            index === currentScrollRange[0] ? "text-accent" : "",
                          )}
                          type="button"
                          onClick={() => {
                            handleScrollTo(index, heading.$heading, heading.anchorId)
                          }}
                        >
                          <span className="duration-200 group-hover:text-accent/80">
                            {heading.title}
                          </span>

                          <span className="ml-4 text-[8px] opacity-50">H{heading.depth}</span>
                        </button>
                      </li>
                    ))}
                  </m.ul>
                </HoverCard.Content>
              )}
            </AnimatePresence>
          </div>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  )
}

const MemoedItem = memo<TocItemProps>((props) => {
  const {
    // active,
    range,
    ...rest
  } = props
  const active = range > 0

  const itemRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active) return

    const $item = itemRef.current
    if (!$item) return
    const $container = $item.parentElement
    if (!$container) return

    const containerHeight = $container.clientHeight
    const itemHeight = $item.clientHeight
    const itemOffsetTop = $item.offsetTop
    const { scrollTop } = $container

    const itemTop = itemOffsetTop - scrollTop
    const itemBottom = itemTop + itemHeight
    if (itemTop < 0 || itemBottom > containerHeight) {
      $container.scrollTop = itemOffsetTop - containerHeight / 2 + itemHeight / 2
    }
  }, [active])

  return <TocItem range={range} {...rest} />
})
MemoedItem.displayName = "MemoedItem"

// Hooks
const useTocItems = (markdownElement: HTMLElement | null) => {
  const $headings = useMemo(
    () =>
      (markdownElement?.querySelectorAll("h1, h2, h3, h4, h5, h6") || []) as HTMLHeadingElement[],
    [markdownElement],
  )

  const toc: ITocItem[] = useMemo(
    () =>
      Array.from($headings).map((el, idx) => {
        const depth = +el.tagName.slice(1)
        const elClone = el.cloneNode(true) as HTMLElement
        const title = elClone.textContent || ""
        const index = idx

        return {
          depth,
          index: Number.isNaN(index) ? -1 : index,
          title,
          anchorId: el.dataset.rid || "",
          $heading: el,
        }
      }),
    [$headings],
  )

  const rootDepth = useMemo(
    () =>
      toc?.length
        ? (toc.reduce(
            (d: number, cur) => Math.min(d, cur.depth),
            toc[0]?.depth || 0,
          ) as any as number)
        : 0,
    [toc],
  )

  return { toc, rootDepth }
}

const useScrollTracking = (toc: ITocItem[]) => {
  const scrollContainerElement = useScrollViewElement()
  const [currentScrollRange, setCurrentScrollRange] = useState([-1, 0] as [number, number])
  const { h } = useWrappedElementSize()
  const getWrappedElPos = useGetWrappedElementPosition()

  const headingRangeParser = () => {
    // calculate the range of data-container-top between each two headings
    const titleBetweenPositionTopRangeMap = [] as [number, number][]
    for (let i = 0; i < toc.length - 1; i++) {
      const { $heading } = toc[i]
      const $nextHeading = toc[i + 1].$heading

      const headingTop =
        Number.parseInt($heading.dataset["containerTop"] || "0") || getElementTop($heading)
      if (!$heading.dataset) {
        // @ts-expect-error
        $heading.dataset["containerTop"] = headingTop.toString()
      }

      const nextTop = getElementTop($nextHeading)
      if (!$nextHeading.dataset) {
        // @ts-expect-error
        $nextHeading.dataset["containerTop"] = nextTop.toString()
      }

      titleBetweenPositionTopRangeMap.push([headingTop, nextTop])
    }
    return titleBetweenPositionTopRangeMap
  }

  const [titleBetweenPositionTopRangeMap, setTitleBetweenPositionTopRangeMap] =
    useState(headingRangeParser)

  useLayoutEffect(() => {
    startTransition(() => {
      setTitleBetweenPositionTopRangeMap(headingRangeParser)
    })
  }, [toc, h])

  const throttleCallerRef = useRef<DebouncedFuncLeading<() => void>>()

  useEffect(() => {
    if (!scrollContainerElement) return

    const handler = throttle(() => {
      const { y } = getWrappedElPos()
      const top = scrollContainerElement.scrollTop + y
      const winHeight = getViewport().h
      const deltaHeight = top >= winHeight ? winHeight : (top / winHeight) * winHeight

      const actualTop = Math.floor(Math.max(0, top - y + deltaHeight)) || 0

      // current top is in which range?
      const currentRangeIndex = titleBetweenPositionTopRangeMap.findIndex(
        ([start, end]) => actualTop >= start && actualTop <= end,
      )
      const currentRange = titleBetweenPositionTopRangeMap[currentRangeIndex]

      if (currentRange) {
        const [start, end] = currentRange

        // current top is this range, the precent is ?
        const precent = (actualTop - start) / (end - start)

        // position , precent
        setCurrentScrollRange([currentRangeIndex, precent])
      } else {
        const last = titleBetweenPositionTopRangeMap.at(-1) || [0, 0]

        if (top + winHeight > last[1]) {
          setCurrentScrollRange([
            titleBetweenPositionTopRangeMap.length,
            1 - (last[1] - top) / winHeight,
          ])
        } else {
          setCurrentScrollRange([-1, 1])
        }
      }
    }, 100)

    throttleCallerRef.current = handler
    scrollContainerElement.addEventListener("scroll", handler)

    return () => {
      scrollContainerElement.removeEventListener("scroll", handler)
      handler.cancel()
    }
  }, [getWrappedElPos, scrollContainerElement, titleBetweenPositionTopRangeMap])

  const handleScrollTo = useEventCallback(
    (i: number, $el: HTMLElement | null, _anchorId: string) => {
      if ($el) {
        const handle = () => {
          springScrollToElement($el, -100, scrollContainerElement!).then(() => {
            throttleCallerRef.current?.cancel()
            setTimeout(() => {
              setCurrentScrollRange([i, 1])
            }, 36)
          })
        }
        handle()
      }
    },
  )

  return { currentScrollRange, handleScrollTo }
}

// Types
interface TocContainerProps {
  className?: string
  toc: ITocItem[]
  rootDepth: number
  currentScrollRange: [number, number]
  handleScrollTo: (i: number, $el: HTMLElement | null, anchorId: string) => void
}

interface TocHoverCardProps extends TocContainerProps {}
