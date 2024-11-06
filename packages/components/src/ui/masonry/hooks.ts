import { nextFrame } from "@follow/utils/dom"
import { throttle } from "lodash-es"
import { useLayoutEffect, useRef, useState } from "react"

import { getCurrentColumn } from "./utils"

export const useMasonryColumn = (gutter: number, onReady?: () => any) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentColumn, setCurrentColumn] = useState(1)
  const [currentItemWidth, setCurrentItemWidth] = useState(0)

  useLayoutEffect(() => {
    let readyCallOnce = false
    const $warpper = containerRef.current
    if (!$warpper) return
    const handler = () => {
      const column = getCurrentColumn($warpper.clientWidth)
      setCurrentItemWidth(Math.trunc($warpper.clientWidth / column - gutter))

      setCurrentColumn(column)

      nextFrame(() => {
        if (readyCallOnce) return
        readyCallOnce = true
        onReady?.()
      })
    }
    const recal = throttle(handler, 1000 / 12)

    let previousWidth = $warpper.offsetWidth
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width

        if (newWidth !== previousWidth) {
          previousWidth = newWidth

          recal()
        }
      }
    })
    recal()
    resizeObserver.observe($warpper)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return {
    containerRef,
    currentColumn,
    currentItemWidth,
  }
}
