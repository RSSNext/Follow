import { usePageVisibility } from "@renderer/hooks/common"
import { appLog } from "@renderer/lib/log"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

const slateTime = 600000 // 10min

const DISPATCH_KEY = "invalidate-query-key"

export class InvalidateQueryEvent extends Event {
  static type = DISPATCH_KEY
  constructor() {
    super(DISPATCH_KEY)
  }
}

/**
 * Add a event listener to invalidate all queries
 */

const InvalidateQueryProviderElectron = () => {
  const queryClient = useQueryClient()

  const currentTimeRef = useRef(Date.now())

  useEffect(() => {
    const handler = () => {
      const now = Date.now()
      if (now - currentTimeRef.current < slateTime) {
        return
      }

      currentTimeRef.current = now

      appLog("Window switch to visible, invalidate all queries")
      queryClient.invalidateQueries()
    }

    document.addEventListener(InvalidateQueryEvent.type, handler)

    return () => {
      document.removeEventListener(InvalidateQueryEvent.type, handler)
    }
  }, [queryClient])
  return null
}

/**
 * Invalidate all queries when the window is visible
 */

const InvalidateQueryProviderWebApp = () => {
  const queryClient = useQueryClient()

  const currentTimeRef = useRef(Date.now())
  const currentVisibilityRef = useRef(!document.hidden)

  const pageVisibility = usePageVisibility()

  useEffect(() => {
    if (currentVisibilityRef.current === pageVisibility) {
      return
    }

    const now = Date.now()
    if (now - currentTimeRef.current < slateTime) {
      return
    }

    currentTimeRef.current = now
    currentVisibilityRef.current = pageVisibility
    if (pageVisibility) {
      appLog("Window switch to visible, invalidate all queries")
      queryClient.invalidateQueries()
    }
  }, [pageVisibility, queryClient])
  return null
}

export const InvalidateQueryProvider = window.electron ?
  InvalidateQueryProviderElectron :
  InvalidateQueryProviderWebApp
