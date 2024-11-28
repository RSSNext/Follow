import { useViewport } from "@follow/components/hooks/useViewport.js"
import { cn } from "@follow/utils/utils"
import * as HoverCard from "@radix-ui/react-hover-card"
import { AnimatePresence, m } from "framer-motion"
import { memo, useContext, useEffect, useRef, useState } from "react"

import { useRealInWideMode } from "~/atoms/settings/ui"
import {
  useWrappedElementPosition,
  useWrappedElementSize,
} from "~/providers/wrapped-element-provider"

import { MarkdownRenderContainerRefContext } from "../context"
import { useScrollTracking, useTocItems } from "./hooks"
import type { TocItemProps } from "./TocItem"
import { TocItem } from "./TocItem"

export interface ITocItem {
  depth: number
  title: string
  anchorId: string
  index: number

  $heading: HTMLHeadingElement
}

export interface TocProps {
  onItemClick?: (index: number, $el: HTMLElement | null, anchorId: string) => void
}

const WiderTocStyle = {
  width: 200,
} satisfies React.CSSProperties
export const Toc: Component<TocProps> = ({ className, onItemClick }) => {
  const markdownElement = useContext(MarkdownRenderContainerRefContext)
  const { toc, rootDepth } = useTocItems(markdownElement)
  const { currentScrollRange, handleScrollTo } = useScrollTracking(toc, {
    onItemClick,
  })

  const renderContentElementPosition = useWrappedElementPosition()
  const renderContentElementSize = useWrappedElementSize()
  const entryContentInWideMode = useRealInWideMode()
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
                          <span className="select-none duration-200 group-hover:text-accent/80">
                            {heading.title}
                          </span>

                          <span className="ml-4 select-none text-[8px] opacity-50">
                            H{heading.depth}
                          </span>
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

// Types
interface TocContainerProps {
  className?: string
  toc: ITocItem[]
  rootDepth: number
  currentScrollRange: [number, number]
  handleScrollTo: (i: number, $el: HTMLElement | null, anchorId: string) => void
}

interface TocHoverCardProps extends TocContainerProps {}
