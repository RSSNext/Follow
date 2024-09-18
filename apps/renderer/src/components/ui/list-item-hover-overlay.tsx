import clsx from "clsx"
import { AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { m } from "~/components/common/Motion"
import { views } from "~/constants"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { FeedViewType } from "~/lib/enum"

export const ListItemHoverOverlay = ({
  className,
  children,
  isActive,
}: {
  className?: string
  children?: React.ReactNode
  isActive?: boolean
}) => {
  const [mouseEnter, setMouseEnter] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const $ref = ref.current
    if (!$ref) return
    const $parent = $ref.parentElement
    if (!$parent) return
    $parent.onfocus = () => {
      setMouseEnter(true)
    }

    $parent.onblur = () => {
      setMouseEnter(false)
    }

    return () => {
      $parent.onfocus = null
      $parent.onblur = null
    }
  }, [])

  const view = useRouteParamsSelector((s) => s.view)

  const mClassName = clsx(
    "absolute z-[-1]",
    view !== FeedViewType.SocialMedia
      ? "bg-zinc-200/80 dark:bg-neutral-800"
      : "bg-zinc-100 dark:bg-neutral-800/50",
    views[view].wideMode ? "inset-x-0 inset-y-1 rounded-xl" : "-inset-x-2 inset-y-0",
    className,
  )
  const motionConfig = {
    initial: {
      opacity: 0.2,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  }

  return (
    <>
      <AnimatePresence>
        {mouseEnter && !isActive && (
          <m.div
            layout
            {...motionConfig}
            layoutId="list-item-hover-overlay"
            className={mClassName}
          />
        )}
      </AnimatePresence>
      {isActive && <m.div {...motionConfig} className={mClassName} />}
      <div
        ref={ref}
        className="relative"
        onMouseEnter={() => {
          setMouseEnter(true)
        }}
        onMouseLeave={() => {
          setMouseEnter(false)
        }}
      >
        {children}
      </div>
    </>
  )
}
