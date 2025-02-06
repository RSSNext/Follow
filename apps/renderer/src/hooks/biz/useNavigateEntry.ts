import { getReadonlyRoute, getStableRouterNavigate } from "@follow/components/atoms/route.js"
import { useMobile } from "@follow/components/hooks/useMobile.js"
import { useSheetContext } from "@follow/components/ui/sheet/context.js"
import type { FeedViewType } from "@follow/constants"
import { useCallback } from "react"

import { disableShowAISummary } from "~/atoms/ai-summary"
import { disableShowAITranslation } from "~/atoms/ai-translation"
import { resetShowSourceContent } from "~/atoms/source-content"
import {
  ROUTE_ENTRY_PENDING,
  ROUTE_FEED_IN_FOLDER,
  ROUTE_FEED_PENDING,
  ROUTE_TIMELINE_OF_INBOX,
  ROUTE_TIMELINE_OF_LIST,
  ROUTE_TIMELINE_OF_VIEW,
} from "~/constants"

export type NavigateEntryOptions = Partial<{
  timelineId: string
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

/*
 * /feeds/:timelineId/:feedId/:entryId
 * timelineId: view-1, list-xxx, inbox-xxx
 * feedId: xxx, folder-xxx
 * entryId: xxx
 */
export const navigateEntry = (options: NavigateEntryOptions) => {
  const { entryId, feedId, view, folderName, inboxId, listId, timelineId } = options || {}
  const { params } = getReadonlyRoute()
  let finalFeedId = feedId || params.feedId || ROUTE_FEED_PENDING
  let finalTimelineId = timelineId || params.timelineId || ROUTE_FEED_PENDING
  const finalEntryId = entryId || ROUTE_ENTRY_PENDING

  if ("feedId" in options && feedId === null) {
    finalFeedId = ROUTE_FEED_PENDING
  }

  if (folderName) {
    finalFeedId = `${ROUTE_FEED_IN_FOLDER}${folderName}`
  }

  finalFeedId = encodeURIComponent(finalFeedId)

  if (view !== undefined) {
    finalTimelineId = `${ROUTE_TIMELINE_OF_VIEW}${view}`
  }

  if (inboxId) {
    finalTimelineId = `${ROUTE_TIMELINE_OF_INBOX}${inboxId}`
  }

  if (listId) {
    finalTimelineId = `${ROUTE_TIMELINE_OF_LIST}${listId}`
  }

  resetShowSourceContent()
  disableShowAISummary()
  disableShowAITranslation()

  if (window.analytics) {
    window.analytics.capture("Navigate Entry", {
      feedId: finalFeedId,
      entryId,
      timelineId: finalTimelineId,
    })
  }

  const path = `/feeds/${finalTimelineId}/${finalFeedId}/${finalEntryId}`

  const currentPath = getReadonlyRoute().location.pathname + getReadonlyRoute().location.search
  if (path === currentPath) return
  return getStableRouterNavigate()?.(path)
}
