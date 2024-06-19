import { levels, ROUTE_FEED_PENDING } from "@renderer/lib/constants"
import { FeedViewType } from "@renderer/lib/enum"
import { redirect } from "react-router-dom"

export function Component() {
  return null
}

export const loader = () =>
  // navigate to the first feed
  redirect(`/feeds/${ROUTE_FEED_PENDING}?view=${FeedViewType.Articles}&level=${levels.view}`)
