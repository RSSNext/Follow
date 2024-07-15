import { getReadonlyRoute, getStableRouterNavigate } from "@renderer/atoms/route"
import { setSidebarActiveView } from "@renderer/atoms/sidebar"
import { ROUTE_ENTRY_PENDING, ROUTE_FEED_PENDING } from "@renderer/lib/constants"
import type { FeedViewType } from "@renderer/lib/enum"
import { isUndefined } from "lodash-es"

type NavigateEntryOptions = Partial<{
  feedId: string | null
  entryId: string | null
  view: FeedViewType
  level: string | null

}>
/**
 * @description a hook to navigate to `feedId`, `entryId`, add search for `view`, `level`
 */
// eslint-disable-next-line @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
export const useNavigateEntry = () => navigateEntry

export const navigateEntry = (options: NavigateEntryOptions) => {
  const { entryId, feedId, level, view } = options || {}
  const { params, searchParams } = getReadonlyRoute()
  let finalFeedId = feedId || params.feedId || ROUTE_FEED_PENDING

  if ("feedId" in options && feedId === null) {
    finalFeedId = ROUTE_FEED_PENDING
  }

  const nextSearchParams = new URLSearchParams(searchParams)

  if (!isUndefined(view)) {
    nextSearchParams.set("view", view.toString())
    setSidebarActiveView(view)
  }
  level && nextSearchParams.set("level", level.toString())

  return getStableRouterNavigate()?.(
      `/feeds/${finalFeedId}/${
        entryId || ROUTE_ENTRY_PENDING
      }?${nextSearchParams.toString()}`,
  )
}
