import { ScrollArea } from "@follow/components/ui/scroll-area/ScrollArea.js"
import { views } from "@follow/constants"
import { clsx } from "clsx"
import { forwardRef } from "react"

import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"

import type { EntryColumnWrapperProps } from "./wrapper.shared"
import { animationStyles, styles } from "./wrapper.shared"

export const EntryColumnWrapper = forwardRef<HTMLDivElement, EntryColumnWrapperProps>(
  ({ children, onScroll }, ref) => {
    const view = useRouteParamsSelector((state) => state.view)

    return (
      <div className={clsx(styles, animationStyles, "mt-2")}>
        <ScrollArea
          scrollbarClassName={!views[view].wideMode ? "w-[5px] p-0" : ""}
          mask={false}
          ref={ref}
          rootClassName={clsx("h-full", views[view].wideMode ? "mt-2" : "")}
          viewportClassName="[&>div]:grow flex"
          onScroll={onScroll}
        >
          {children}
        </ScrollArea>
      </div>
    )
  },
)
