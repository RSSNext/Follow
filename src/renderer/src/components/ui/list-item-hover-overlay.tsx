"use client"

import { views } from "@renderer/constants"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import clsx from "clsx"
import { AnimatePresence, m } from "framer-motion"
import { useEffect, useRef, useState } from "react"

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
    "absolute",
    "bg-zinc-200/80 dark:bg-neutral-800",
    views[view].wideMode ? "inset-0 rounded-xl" : "-inset-x-2 inset-y-0",
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
        {(mouseEnter && !isActive) && (
          <m.div
            layout
            {...motionConfig}
            layoutId="list-item-hover-overlay"
            className={mClassName}
          />
        )}
      </AnimatePresence>
      {isActive && (
        <m.div
          {...motionConfig}
          className={mClassName}
        />
      )}
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
