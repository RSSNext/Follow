import { useReadonlyRouteSelector } from "@renderer/atoms"
import { FeedViewType } from "@renderer/lib/enum"
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

export const useRouteParms = () => {
  const params = useParams()
  const [search] = useSearchParams()
  const view = useRouteView()

  let feedId: string | number = params.feedId!

  // If feedId is a number, it's a FeedViewType
  if (feedId && FeedViewTypeValues.includes(feedId as string)) {
    feedId = Number.parseInt(feedId as string)
  }

  return {
    view,
    entryId: params.entryId || undefined,
    feedId: params.feedId || undefined,
    level: search.get("level") || undefined,
    category: search.get("category") || undefined,
  }
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

      let feedId: string | number = params.feedId!

      // If feedId is a number, it's a FeedViewType
      if (feedId && FeedViewTypeValues.includes(feedId as string)) {
        feedId = Number.parseInt(feedId as string)
      }

      const view = searchParams.get("view")

      const finalView =
      (view && FeedViewTypeValues.includes(view) ?
          +view :
        FeedViewType.Articles) || FeedViewType.Articles

      return selector({
        entryId: params.entryId || undefined,
        feedId: params.feedId || undefined,
        level: searchParams.get("level") || undefined,
        category: searchParams.get("category") || undefined,
        view: finalView,
      })
    }, deps)
