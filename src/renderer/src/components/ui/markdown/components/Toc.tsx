import { springScrollToElement } from "@renderer/lib/scroller"
import { cn } from "@renderer/lib/utils"
import { atom, useAtom } from "jotai"
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
  if (toc.length === 0) return null
  return (
    <div className="flex grow flex-col scroll-smooth px-2 scrollbar-none">
      <ul
        ref={setTreeRef}
        className={cn("group overflow-auto scrollbar-none", className)}
      >
        {toc?.map((heading) => (
          <MemoedItem
            heading={heading}
            isActive={heading.anchorId === activeId}
            key={heading.title}
            rootDepth={rootDepth}
            onClick={handleScrollTo}
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

const MemoedItem = memo<{
  isActive: boolean
  heading: ITocItem
  rootDepth: number
  onClick?: (i: number, $el: HTMLElement | null, anchorId: string) => void
}>((props) => {
      const {
        heading,
        isActive,
        onClick,
        rootDepth,
        // containerRef
      } = props

      const itemRef = useRef<HTMLElement>(null)

      useEffect(() => {
        if (!isActive) return

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
      }, [isActive])

      return (
        <TocItem
          heading={heading}
          onClick={onClick}
          active={isActive}
          key={heading.title}
          rootDepth={rootDepth}
        />
      )
    })
MemoedItem.displayName = "MemoedItem"
