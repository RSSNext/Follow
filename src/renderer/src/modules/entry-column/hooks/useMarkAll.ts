import { useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import { subscriptionActions } from "@renderer/store/subscription"
import { useFolderFeedsByFeedId } from "@renderer/store/subscription/hooks"
import { useCallback } from "react"

export interface MarkAllFilter {
  startTime: number
  endTime: number
}
export const useMarkAll = (filter?: MarkAllFilter) => {
  const routerParams = useRouteParms()
  const { feedId, view } = routerParams
  const folderIds = useFolderFeedsByFeedId({
    feedId,
    view,
  })

  return useCallback(async () => {
    if (!routerParams) return

    if (typeof routerParams.feedId === "number" || routerParams.isAllFeeds) {
      subscriptionActions.markReadByView(view, filter)
    } else if (folderIds) {
      subscriptionActions.markReadByFeedIds(folderIds, view, filter)
    } else if (routerParams.feedId) {
      subscriptionActions.markReadByFeedIds(
        routerParams.feedId?.split(","),
        view,
        filter,
      )
    }
  }, [routerParams, folderIds, view, filter])
}
