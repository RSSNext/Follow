import { ScrollElementContext } from "@follow/components/ui/scroll-area/ctx.js"
import { views } from "@follow/constants"
import { clsx } from "clsx"
import { forwardRef, useState } from "react"

import { PullToRefresh } from "~/components/ux/pull-to-refresh"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"

import { CornerPlayer } from "../player/corner-player"
import type { EntryColumnWrapperProps } from "./wrapper.shared"
import { styles } from "./wrapper.shared"

const noop = async () => {}

export const EntryColumnWrapper = forwardRef<HTMLDivElement, EntryColumnWrapperProps>(
  ({ children, onPullToRefresh }, ref) => {
    const view = useRouteParamsSelector((state) => state.view)

    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)
    return (
      <div className={clsx(styles, "relative flex flex-col")}>
        <div ref={ref} className={clsx("grow overflow-hidden", views[view].wideMode ? "mt-2" : "")}>
          <PullToRefresh className="h-full" onRefresh={onPullToRefresh || noop}>
            <ScrollElementContext.Provider value={scrollElement}>
              <div className="h-full overflow-y-auto" ref={setScrollElement}>
                {children}
              </div>
            </ScrollElementContext.Provider>
          </PullToRefresh>
        </div>

        <CornerPlayer className="w-full md:w-[350px]" />
      </div>
    )
  },
)
