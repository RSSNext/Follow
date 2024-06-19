/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ROUTE_FEED_PENDING } from "@renderer/lib/constants"
import type { FeedViewType } from "@renderer/lib/enum"
import { isUndefined } from "lodash-es"
import { useCallback } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

type NavigateEntryOptions = Partial<{
  feedId: string | null
  entryId: string | null
  view: FeedViewType
  level: string | null
}>
/**
 * @description a hook to navigate to `feedId`, `entryId`, add search for `view`, `level`
 */
export const useNavigateEntry = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const params = useParams()
  return useCallback(
    (options: NavigateEntryOptions) => {
      const { entryId, feedId, level, view } = options || {}
      let finalFeedId = feedId || params.feedId || ROUTE_FEED_PENDING

      if ("feedId" in options && feedId === null) {
        finalFeedId = ROUTE_FEED_PENDING
      }

      const nextSearchParams = new URLSearchParams(searchParams)

      !isUndefined(view) && nextSearchParams.set("view", view.toString())
      level && nextSearchParams.set("level", level.toString())

      return navigate(
        `/feeds/${finalFeedId}/${
          entryId || ROUTE_FEED_PENDING
        }?${nextSearchParams.toString()}`,
      )
    },
    [navigate, params.feedId, searchParams],
  )
}
