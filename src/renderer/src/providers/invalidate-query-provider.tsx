import { usePageVisibility } from "@renderer/hooks/common"
import { appLog } from "@renderer/lib/log"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

/**
 * InvalidateQuery when electron app window switch to visible, macOS dock icon click
 */
export const InvalidateQueryProvider = () => {
  const queryClient = useQueryClient()

  const currentVisibilityRef = useRef(!document.hidden)

  const pageVisibility = usePageVisibility()

  useEffect(() => {
    if (currentVisibilityRef.current === pageVisibility) {
      return
    }
    currentVisibilityRef.current = pageVisibility
    if (pageVisibility) {
      appLog("Window switch to visible, invalidate all queries")
      queryClient.invalidateQueries()
    }
  }, [pageVisibility, queryClient])
  return null
}
