import { springScrollToElement } from "@renderer/lib/scroller"
import { cn } from "@renderer/lib/utils"
import {
  useGetWrappedElementPosition,
} from "@renderer/providers/wrapped-element-provider"
import { atom, useAtom } from "jotai"
import { throttle } from "lodash-es"
import {
  memo,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"

import { useScrollViewElement } from "../../scroll-area/hooks"
import { MarkdownRenderContainerRefContext } from "../context"
import type { TocItemProps } from "./TocItem"
import { TocItem } from "./TocItem"

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
  const [activeId, setActiveId] = useActiveId($headings)

  const scrollContainerElement = useScrollViewElement()

  const handleScrollTo = useEventCallback(
    (i: number, $el: HTMLElement | null, anchorId: string) => {
      if ($el) {
        const handle = () => {
          springScrollToElement($el, -100, scrollContainerElement!).then(() => {
            setActiveId?.(anchorId)
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
      const $nextHeading = $headings[i + 1]
      const top = Number.parseInt($heading.dataset["containerTop"] || "0")
      const nextTop = Number.parseInt(
        $nextHeading.dataset["containerTop"] || "0",
      )

      titleBetweenPositionTopRangeMap.push([top, nextTop])
    }
    return titleBetweenPositionTopRangeMap
  }, [$headings])

  const getWrappedElPos = useGetWrappedElementPosition()

  useEffect(() => {
    if (!scrollContainerElement) return

    const handler = throttle(() => {
      const top = scrollContainerElement.scrollTop + getWrappedElPos().y

      // current top is in which range?
      const currentRangeIndex = titleBetweenPositionTopRangeMap.findIndex(
        ([start, end]) => top >= start && top <= end,
      )
      const currentRange = titleBetweenPositionTopRangeMap[currentRangeIndex]

      if (currentRange) {
        const [start, end] = currentRange

        // current top is this range, the precent is ?
        const precent = (top - start) / (end - start)

        // position , precent
        setCurrentScrollRange([currentRangeIndex, precent])
      }
    }, 100)
    scrollContainerElement.addEventListener("scroll", handler)

    return () => {
      scrollContainerElement.removeEventListener("scroll", handler)
    }
  }, [
    getWrappedElPos,
    scrollContainerElement,
    titleBetweenPositionTopRangeMap,
  ])

  if (toc.length === 0) return null
  return (
    <div className="flex grow flex-col scroll-smooth px-2 scrollbar-none">
      <ul
        ref={setTreeRef}
        className={cn("group overflow-auto scrollbar-none", className)}
      >
        {toc.map((heading, index) => (
          <MemoedItem
            heading={heading}
            active={heading.anchorId === activeId}
            key={heading.title}
            rootDepth={rootDepth}
            onClick={handleScrollTo}
            isScrollOut={index < currentScrollRange[0]}
            range={index === currentScrollRange[0] ? currentScrollRange[1] : 0}
          />
        ))}
      </ul>
    </div>
  )
}
const tocActiveIdAtom = atom<string | null>(null)
function useActiveId($headings: HTMLHeadingElement[]) {
  const [activeId, setActiveId] = useAtom(tocActiveIdAtom)
  const scrollContainerElement = useScrollViewElement()
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTransition(() => {
              setActiveId((entry.target as HTMLElement).dataset.rid || "")
            })
          }
        })
      },
      { rootMargin: `-100px 0px -100px 0px`, root: scrollContainerElement },
    )
    $headings.forEach(($heading) => {
      observer.observe($heading)
    })
    return () => {
      observer.disconnect()
    }
  }, [$headings, scrollContainerElement, setActiveId])

  return [activeId, setActiveId] as const
}

const MemoedItem = memo<TocItemProps>((props) => {
  const {
    active,

    ...rest
  } = props

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

  return <TocItem active={active} {...rest} />
})
MemoedItem.displayName = "MemoedItem"
