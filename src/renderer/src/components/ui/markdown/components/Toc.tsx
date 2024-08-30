import * as HoverCard from "@radix-ui/react-hover-card"
import { getViewport } from "@renderer/atoms/hooks/viewport"
import { getElementTop } from "@renderer/lib/dom"
import { springScrollToElement } from "@renderer/lib/scroller"
import { cn } from "@renderer/lib/utils"
import { useGetWrappedElementPosition } from "@renderer/providers/wrapped-element-provider"
import { AnimatePresence, m } from "framer-motion"
import { throttle } from "lodash-es"
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"

import { useScrollViewElement } from "../../scroll-area/hooks"
import { MarkdownRenderContainerRefContext } from "../context"
import type { TocItemProps } from "./TocItem"
import { TocItem } from "./TocItem"

type DebouncedFuncLeading<T extends (...args: any[]) => any> = T & {
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

export const Toc: Component = ({ className }) => {
  const markdownElement = useContext(MarkdownRenderContainerRefContext)

  const $headings = useMemo(
    () =>
      (markdownElement?.querySelectorAll("h1, h2, h3, h4, h5, h6") ||
        []) as HTMLHeadingElement[],
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
      toc?.length ?
          (toc.reduce(
            (d: number, cur) => Math.min(d, cur.depth),
            toc[0]?.depth || 0,
          ) as any as number) :
        0,
    [toc],
  )

  const [_, setTreeRef] = useState<HTMLUListElement | null>()

  const scrollContainerElement = useScrollViewElement()

  const scrollDelayHandlerRef = useRef<any>(null)

  const handleScrollTo = useEventCallback(
    (i: number, $el: HTMLElement | null, _anchorId: string) => {
      if ($el) {
        const handle = () => {
          scrollDelayHandlerRef.current &&
          clearTimeout(scrollDelayHandlerRef.current)
          springScrollToElement($el, -100, scrollContainerElement!).then(() => {
            throttleCallerRef.current?.cancel()
            scrollDelayHandlerRef.current = setTimeout(() => {
              setCurrentScrollRange([i, 1])
            }, 36)
          })
        }
        handle()
      }
    },
  )

  const [currentScrollRange, setCurrentScrollRange] = useState([-1, 0])
  const titleBetweenPositionTopRangeMap = useMemo(() => {
    // calculate the range of data-container-top between each two headings
    const titleBetweenPositionTopRangeMap = [] as [number, number][]
    for (let i = 0; i < $headings.length - 1; i++) {
      const $heading = $headings[i]

      const headingTop =
        Number.parseInt($heading.dataset["containerTop"] || "0") ||
        getElementTop($heading)
      if (!$heading.dataset) {
        // @ts-expect-error
        $heading.dataset["containerTop"] = headingTop.toString()
      }

      const $nextHeading = $headings[i + 1]

      const nextTop = getElementTop($nextHeading)
      if (!$nextHeading.dataset) {
        // @ts-expect-error
        $nextHeading.dataset["containerTop"] = nextTop.toString()
      }

      titleBetweenPositionTopRangeMap.push([headingTop, nextTop])
    }
    return titleBetweenPositionTopRangeMap
  }, [$headings])

  const throttleCallerRef = useRef<DebouncedFuncLeading<() => void>>()
  const getWrappedElPos = useGetWrappedElementPosition()

  useEffect(() => {
    if (!scrollContainerElement) return

    const handler = throttle(() => {
      const { y } = getWrappedElPos()
      const top = scrollContainerElement.scrollTop + y
      const winHeight = getViewport().h
      const deltaHeight =
        top >= winHeight ? winHeight : (top / winHeight) * winHeight

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
        if (top > last[1]) {
          setCurrentScrollRange([
            titleBetweenPositionTopRangeMap.length - 1,
            1,
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
    }
  }, [
    getWrappedElPos,
    scrollContainerElement,
    titleBetweenPositionTopRangeMap,
  ])

  const [hoverShow, setHoverShow] = useState(false)

  if (toc.length === 0) return null
  return (
    <div className="flex grow flex-col scroll-smooth px-2 scrollbar-none">
      <HoverCard.Root
        openDelay={100}
        open={hoverShow}
        onOpenChange={setHoverShow}
      >
        <HoverCard.Trigger asChild>
          <ul
            ref={setTreeRef}
            className={cn("group overflow-auto scrollbar-none", className)}
          >
            {toc.map((heading, index) => (
              <MemoedItem
                heading={heading}
                key={heading.title}
                rootDepth={rootDepth}
                onClick={handleScrollTo}
                isScrollOut={index < currentScrollRange[0]}
                range={
                  index === currentScrollRange[0] ? currentScrollRange[1] : 0
                }
              />
            ))}
          </ul>
        </HoverCard.Trigger>
        <HoverCard.Portal forceMount>
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
                      key={heading.title}
                      className="flex h-[24px] w-full items-center"
                    >
                      <button
                        className={cn(
                          "group flex w-full cursor-pointer justify-between",
                          index === currentScrollRange[0] ? "text-accent" : "",
                        )}
                        type="button"
                        onClick={() => {
                          handleScrollTo(
                            index,
                            heading.$heading,
                            heading.anchorId,
                          )
                        }}
                      >
                        <span className="duration-200 group-hover:text-accent/80">
                          {heading.title}
                        </span>

                        <span className="ml-4 text-[8px] opacity-50">
                          H{heading.depth}
                        </span>
                      </button>
                    </li>
                  ))}
                </m.ul>
              </HoverCard.Content>
            )}
          </AnimatePresence>
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
      $container.scrollTop =
        itemOffsetTop - containerHeight / 2 + itemHeight / 2
    }
  }, [active])

  return <TocItem range={range} {...rest} />
})
MemoedItem.displayName = "MemoedItem"
