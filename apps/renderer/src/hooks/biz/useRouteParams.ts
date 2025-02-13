import { getReadonlyRoute, useReadonlyRouteSelector } from "@follow/components/atoms/route.js"
import { FeedViewType } from "@follow/constants"
import type { Params } from "react-router"
import { useParams } from "react-router"

import {
  FEED_COLLECTION_LIST,
  ROUTE_ENTRY_PENDING,
  ROUTE_FEED_IN_FOLDER,
  ROUTE_FEED_PENDING,
  ROUTE_TIMELINE_OF_INBOX,
  ROUTE_TIMELINE_OF_LIST,
  ROUTE_TIMELINE_OF_VIEW,
} from "~/constants"
import { getListById } from "~/store/list"

export const useRouteEntryId = () => {
  const { entryId } = useParams()
  return entryId
}

export const useRouteFeedId = () => {
  const { feedId } = useParams()
  return feedId
}

export interface BizRouteParams {
  view: FeedViewType
  entryId?: string
  feedId?: string
  isCollection: boolean
  isAllFeeds: boolean
  isPendingEntry: boolean
  folderName?: string
  inboxId?: string
  listId?: string
  timelineId?: string
}

const parseRouteParams = (params: Params<any>): BizRouteParams => {
  const listId = params.timelineId?.startsWith(ROUTE_TIMELINE_OF_LIST)
    ? params.timelineId.slice(ROUTE_TIMELINE_OF_LIST.length)
    : undefined
  const list = listId ? getListById(listId) : undefined

  return {
    view: params.timelineId?.startsWith(ROUTE_TIMELINE_OF_VIEW)
      ? (Number.parseInt(
          params.timelineId.slice(ROUTE_TIMELINE_OF_VIEW.length),
          10,
        ) as FeedViewType)
      : (list?.view ?? FeedViewType.Articles),
    entryId: params.entryId || undefined,
    feedId: params.feedId || undefined,
    // alias
    isCollection: params.feedId === FEED_COLLECTION_LIST,
    isAllFeeds: params.feedId === ROUTE_FEED_PENDING,
    isPendingEntry: params.entryId === ROUTE_ENTRY_PENDING,
    folderName: params.feedId?.startsWith(ROUTE_FEED_IN_FOLDER)
      ? params.feedId.slice(ROUTE_FEED_IN_FOLDER.length)
      : undefined,
    inboxId: params.timelineId?.startsWith(ROUTE_TIMELINE_OF_INBOX)
      ? params.timelineId.slice(ROUTE_TIMELINE_OF_INBOX.length)
      : undefined,
    listId,
    timelineId: params.timelineId,
  }
}

export const useRouteParams = () => {
  return useRouteParamsSelector((s) => s)
}

const noop = [] as any[]

export const useRouteParamsSelector = <T>(
  selector: (params: BizRouteParams) => T,
  deps = noop,
): T =>
  useReadonlyRouteSelector((route) => {
    const { params } = route

    return selector(parseRouteParams(params))
  }, deps)

export const getRouteParams = () => {
  const route = getReadonlyRoute()
  const { params } = route
  return parseRouteParams(params)
}
