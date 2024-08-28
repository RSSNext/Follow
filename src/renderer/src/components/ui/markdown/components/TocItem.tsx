import { cn } from "@renderer/lib/utils"
import type { FC, MouseEvent } from "react"
import {
  memo,
  useCallback,
  useRef,
} from "react"

export interface ITocItem {
  depth: number
  title: string
  anchorId: string
  index: number

  $heading: HTMLHeadingElement
}

export const TocItem: FC<{
  heading: ITocItem

  active: boolean
  rootDepth: number
  onClick?: (i: number, $el: HTMLElement | null, anchorId: string) => void
}> = memo((props) => {
  const { active, onClick, heading } = props
  const { $heading, anchorId, depth, index, title } = heading

  const $ref = useRef<HTMLButtonElement>(null)

  // useEffect(() => {
  //   if (active) {
  //     $ref.current?.scrollIntoView({ behavior: "smooth" })
  //   }
  // }, [])
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
        className={cn(
          "inline-block h-1.5 rounded-full",
          "bg-stone-100 duration-200 hover:!bg-stone-400 group-hover:bg-stone-400/50",
          "dark:bg-stone-800 dark:hover:!bg-stone-600 dark:group-hover:bg-stone-600/50",
          active && "!bg-stone-400 dark:!bg-stone-600",
        )}
      />
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
