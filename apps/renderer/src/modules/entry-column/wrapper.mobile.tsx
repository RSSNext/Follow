import { FeedViewType, views } from "@follow/constants"
import { clsx } from "clsx"
import { forwardRef } from "react"

import { PullToRefresh } from "~/components/ux/pull-to-refresh"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"

import { CornerPlayer } from "../player/corner-player"
import type { EntryColumnWrapperProps } from "./wrapper.shared"
import { styles } from "./wrapper.shared"

const noop = async () => {}

const selectorMap = {
  // Masonry
  [FeedViewType.Pictures]: "#entry-column-wrapper",
}
export const EntryColumnWrapper = forwardRef<HTMLDivElement, EntryColumnWrapperProps>(
  ({ children, onPullToRefresh }, ref) => {
    const view = useRouteParamsSelector((state) => state.view)

    return (
      <div className={clsx(styles, "relative flex flex-col")}>
        <div ref={ref} className={clsx("grow overflow-hidden", views[view].wideMode ? "mt-2" : "")}>
          <PullToRefresh
            className="h-full"
            scrollContainerSelector={selectorMap[view]}
            onRefresh={onPullToRefresh || noop}
          >
            <div id="entry-column-wrapper" className="h-full overflow-y-auto">
              {children}
            </div>
          </PullToRefresh>
        </div>

        <CornerPlayer className="w-full md:w-[350px]" />
      </div>
    )
  },
)
