import { getReadonlyRoute, getStableRouterNavigate } from "@follow/components/atoms/route.js"
import { isMobile, useMobile } from "@follow/components/hooks/useMobile.js"
import { useSheetContext } from "@follow/components/ui/sheet/context.js"
import { FeedViewType } from "@follow/constants"
import { isUndefined } from "es-toolkit/compat"
import { useCallback } from "react"

import { disableShowAISummary } from "~/atoms/ai-summary"
import { disableShowAITranslation } from "~/atoms/ai-translation"
import { setSidebarActiveView } from "~/atoms/sidebar"
import { resetShowSourceContent } from "~/atoms/source-content"
import {
  ROUTE_ENTRY_PENDING,
  ROUTE_FEED_IN_FOLDER,
  ROUTE_FEED_IN_INBOX,
  ROUTE_FEED_IN_LIST,
  ROUTE_FEED_PENDING,
} from "~/constants"

export type NavigateEntryOptions = Partial<{
  feedId: string | null
  entryId: string | null
  view: FeedViewType
  folderName: string
  inboxId: string
  listId: string
}>
/**
 * @description a hook to navigate to `feedId`, `entryId`, add search for `view`, `level`
 */
export const useNavigateEntry = () => {
  const sheetContext = useSheetContext()
  const isMobile = useMobile()
  return useCallback(
    (options: NavigateEntryOptions) => {
      navigateEntry(options)
      if (isMobile && sheetContext) {
        sheetContext.dismiss()
      }
    },
    [isMobile, sheetContext],
  )
}

export const navigateEntry = (options: NavigateEntryOptions) => {
  const { entryId, feedId, view, folderName, inboxId, listId } = options || {}
  const { params, searchParams } = getReadonlyRoute()
  let finalFeedId = feedId || params.feedId || ROUTE_FEED_PENDING

  if ("feedId" in options && feedId === null) {
    finalFeedId = ROUTE_FEED_PENDING
  }

  if (folderName) {
    finalFeedId = `${ROUTE_FEED_IN_FOLDER}${folderName}`
  }

  if (inboxId) {
    finalFeedId = `${ROUTE_FEED_IN_INBOX}${inboxId}`
  }

  if (listId) {
    finalFeedId = `${ROUTE_FEED_IN_LIST}${listId}`
  }

  finalFeedId = encodeURIComponent(finalFeedId)
  const nextSearchParams = new URLSearchParams(searchParams)

  if (!isUndefined(view)) {
    nextSearchParams.set("view", view.toString())
    setSidebarActiveView(view)
  }
  resetShowSourceContent()
  disableShowAISummary()
  disableShowAITranslation()

  const finalView = nextSearchParams.get("view")

  if (window.analytics) {
    window.analytics.capture("Navigate Entry", {
      feedId: finalFeedId,
      entryId,
      view: finalView ? Number.parseInt(finalView, 10) : FeedViewType.Articles,
    })
  }

  let path = `/feeds`
  if (finalFeedId) {
    path += `/${finalFeedId}`
  }
  if (entryId) {
    path += `/${entryId}`
  } else {
    if (!isMobile()) path += `/${ROUTE_ENTRY_PENDING}`
  }
  return getStableRouterNavigate()?.(`${path}?${nextSearchParams.toString()}`)
}
