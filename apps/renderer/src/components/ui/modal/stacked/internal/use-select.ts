import { useCallback, useRef } from "react"

import { nextFrame } from "~/lib/dom"

/**
 * @internal
 *
 * Handle select text in modal
 */
export const useModalSelect = () => {
  const isSelectingRef = useRef(false)
  const handleSelectStart = useCallback(() => {
    isSelectingRef.current = true
  }, [])
  const handleDetectSelectEnd = useCallback(() => {
    nextFrame(() => {
      if (isSelectingRef.current) {
        isSelectingRef.current = false
      }
    })
  }, [])

  return {
    isSelectingRef,
    handleSelectStart,
    handleDetectSelectEnd,
  }
}
