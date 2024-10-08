import { IN_ELECTRON } from "@follow/shared/constants"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

import { usePageVisibility } from "~/hooks/common"
import { appLog } from "~/lib/log"

const slateTime = 600000 // 10min

export class ElectronCloseEvent extends Event {
  static type = "electron-close"
  constructor() {
    super("electron-close")
  }
}
export class ElectronShowEvent extends Event {
  static type = "electron-show"
  constructor() {
    super("electron-show")
  }
}

/**
 * Add a event listener to invalidate all queries
 */

const InvalidateQueryProviderElectron = () => {
  const queryClient = useQueryClient()

  const currentTimeRef = useRef(0)

  useEffect(() => {
    const handler = () => {
      currentTimeRef.current = Date.now()
      appLog("Window switch to close")
    }

    document.addEventListener(ElectronCloseEvent.type, handler)

    return () => {
      document.removeEventListener(ElectronCloseEvent.type, handler)
    }
  }, [queryClient])

  useEffect(() => {
    const handler = () => {
      const now = Date.now()
      if (!currentTimeRef.current || now - currentTimeRef.current < slateTime) {
        appLog(
          `Window switch to visible, but skip invalidation, ${currentTimeRef.current ? now - currentTimeRef.current : 0}`,
        )
      } else {
        appLog("Window switch to visible, invalidate all queries")
        queryClient.invalidateQueries()
      }
      currentTimeRef.current = 0
    }

    document.addEventListener(ElectronShowEvent.type, handler)

    return () => {
      document.removeEventListener(ElectronShowEvent.type, handler)
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

export const InvalidateQueryProvider = IN_ELECTRON
  ? InvalidateQueryProviderElectron
  : InvalidateQueryProviderWebApp
