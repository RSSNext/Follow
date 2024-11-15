import { views } from "@follow/constants"
import { clsx } from "clsx"
import { forwardRef } from "react"

import { PullToRefresh } from "~/components/pull-to-refresh"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"

import { CornerPlayer } from "../player/corner-player"
import type { EntryColumnWrapperProps } from "./wrapper.shared"
import { styles } from "./wrapper.shared"

const noop = async () => {}
export const EntryColumnWrapper = forwardRef<HTMLDivElement, EntryColumnWrapperProps>(
  ({ children, onPullToRefresh }, ref) => {
    const view = useRouteParamsSelector((state) => state.view)
    const routeFeedId = useRouteParamsSelector((state) => state.feedId)

    return (
      <div key={`${routeFeedId}-${view}`} className={clsx(styles, "relative flex flex-col")}>
        <div ref={ref} className={clsx("grow overflow-hidden", views[view].wideMode ? "mt-2" : "")}>
          <PullToRefresh className="h-full" onRefresh={onPullToRefresh || noop}>
            {children}
          </PullToRefresh>
        </div>

        <CornerPlayer className="w-full md:w-[350px]" />
      </div>
    )
  },
)
