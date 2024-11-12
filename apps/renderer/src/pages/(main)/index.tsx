import { isMobile } from "@follow/components/hooks/useMobile.js"
import { FeedViewType } from "@follow/constants"
import { redirect } from "react-router-dom"

import { ROUTE_ENTRY_PENDING, ROUTE_FEED_PENDING } from "~/constants"
import { MobileFeedScreen } from "~/modules/app-layout/left-sidebar"

export function Component() {
  return <MobileFeedScreen />
}

export const loader = () => {
  const mobile = isMobile()
  if (!mobile) {
    // navigate to the first feed
    return redirect(
      `/feeds/${ROUTE_FEED_PENDING}/${ROUTE_ENTRY_PENDING}?view=${FeedViewType.Articles}`,
    )
  }
  return {}
}
