import { cn } from "@renderer/lib/utils"
import type { FC, MouseEvent } from "react"
import { memo, useCallback, useRef } from "react"

export interface ITocItem {
  depth: number
  title: string
  anchorId: string
  index: number

  $heading: HTMLHeadingElement
}

export interface TocItemProps {
  heading: ITocItem
  active: boolean
  rootDepth: number
  onClick?: (i: number, $el: HTMLElement | null, anchorId: string) => void

  isScrollOut: boolean
  range: number
}

export const TocItem: FC<TocItemProps> = memo((props) => {
  const { active, onClick, heading, isScrollOut, range } = props
  const { $heading, anchorId, depth, index, title } = heading

  const $ref = useRef<HTMLButtonElement>(null)

  return (
    <button
      type="button"
      ref={$ref}
      data-index={index}
      className="block cursor-pointer"
      data-depth={depth}
      onClick={useCallback(
        (e: MouseEvent) => {
          e.preventDefault()

          onClick?.(index, $heading, anchorId)
        },
        [anchorId, onClick, index, $heading],
      )}
      title={title}
    >
      <span
        style={{
          width: widthMap[depth],
        }}
        data-active={active}
        className={cn(
          "relative inline-block h-1.5 rounded-full",
          "bg-zinc-100 duration-200 hover:!bg-zinc-400 group-hover:bg-zinc-400/50",
          isScrollOut && "bg-zinc-400/80",

          "dark:bg-zinc-800/80 dark:hover:!bg-zinc-600 dark:group-hover:bg-zinc-600/50",
          isScrollOut && "dark:bg-zinc-700",
          active &&
          "!bg-zinc-400/50 data-[active=true]:group-hover:!bg-zinc-500 dark:!bg-zinc-600",
        )}
      >
        <span
          className="absolute inset-y-0 left-0 z-[1] rounded-full bg-zinc-600 duration-75 ease-linear dark:bg-zinc-400"
          style={{
            width: `${range * 100}%`,
          }}
        />
      </span>
    </button>
  )
})

const widthMap = {
  1: 72,
  2: 60,
  3: 48,
  4: 36,
  5: 24,
  6: 12,
}

TocItem.displayName = "TocItem"
