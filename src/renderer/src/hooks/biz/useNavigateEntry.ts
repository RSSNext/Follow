/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ROUTE_FEED_PENDING } from "@renderer/lib/constants"
import type { FeedViewType } from "@renderer/lib/enum"
import { isUndefined } from "lodash-es"
import { useCallback } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

import { useRefValue } from "../common"

type NavigateEntryOptions = Partial<{
  feedId: string | null
  entryId: string | null
  view: FeedViewType
  level: string | null

  category: string | null
}>
/**
 * @description a hook to navigate to `feedId`, `entryId`, add search for `view`, `level`
 */
export const useNavigateEntry = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const params = useParams()

  const paramsRef = useRefValue(params)
  const searchRef = useRefValue(searchParams)
  return useCallback(
    (options: NavigateEntryOptions) => {
      const { entryId, feedId, level, view, category } = options || {}
      let finalFeedId = feedId || paramsRef.current.feedId || ROUTE_FEED_PENDING

      if ("feedId" in options && feedId === null) {
        finalFeedId = ROUTE_FEED_PENDING
      }

      const nextSearchParams = new URLSearchParams(searchRef.current)

      !isUndefined(view) && nextSearchParams.set("view", view.toString())
      level && nextSearchParams.set("level", level.toString())

      if ("category" in options) {
        if (!category) {
          nextSearchParams.delete("category")
        } else {
          nextSearchParams.set("category", category.toString())
        }
      }

      return navigate(
        `/feeds/${finalFeedId}/${
          entryId || ROUTE_FEED_PENDING
        }?${nextSearchParams.toString()}`,
      )
    },
    [navigate, paramsRef, searchRef],
  )
}
