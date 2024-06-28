import { getReadonlyRoute, useReadonlyRouteSelector } from "@renderer/atoms"
import { FeedViewType } from "@renderer/lib/enum"
import type { Params } from "react-router-dom"
import { useParams, useSearchParams } from "react-router-dom"
// '0', '1', '2', '3', '4', '5',
const FeedViewTypeValues = (() => {
  const values = Object.values(FeedViewType)
  return values.slice(values.length / 2).map((v) => v.toString())
})()
export const useRouteView = () => {
  const [search] = useSearchParams()
  const view = search.get("view")

  return (
    (view && FeedViewTypeValues.includes(view) ?
        +view :
      FeedViewType.Articles) || FeedViewType.Articles
  )
}

export const useRouteEntryId = () => {
  const { entryId } = useParams()
  return entryId
}

export const useRouteFeedId = () => {
  const { feedId } = useParams()
  return feedId
}

const parseRouteParams = (
  params: Params<any>,
  search: URLSearchParams,
) => {
  const _view = search.get("view")

  const view = (
    (_view && FeedViewTypeValues.includes(_view) ?
        +_view :
      FeedViewType.Articles) || FeedViewType.Articles
  )

  return {
    view,
    entryId: params.entryId || undefined,
    feedId: params.feedId || undefined,
    level: search.get("level") || undefined,
    category: search.get("category") || undefined,
  }
}

export const useRouteParms = () => {
  const params = useParams()
  const [search] = useSearchParams()

  return parseRouteParams(params, search)
}
const noop = [] as any[]
export const useRouteParamsSelector = <T>(
  selector: (params: {
    entryId: string | undefined
    feedId: string | undefined
    level: string | undefined
    category: string | undefined
    view: FeedViewType
  }) => T,
  deps = noop,
): T =>
    useReadonlyRouteSelector((route) => {
      const { searchParams, params } = route

      return selector(parseRouteParams(params, searchParams))
    }, deps)

export const getRouteParams = () => {
  const route = getReadonlyRoute()
  const { searchParams, params } = route
  return parseRouteParams(params, searchParams)
}
