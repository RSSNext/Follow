import { RelativeDay } from "@renderer/components/ui/datetime"
import { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import { memo } from "react"

import { SocialMediaDateItem } from "../Items/social-media-item"
import { MarkAllButton } from "./mark-all-button"

export const DateItem = memo(
  ({
    date,
    view,
    isFirst,
  }: {
    date: string
    view: FeedViewType
    isFirst: boolean
  }) => {
    const dateObj = new Date(date)

    const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0)).getTime()
    const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999)).getTime()

    const className = cn(
      isFirst ? "pt-2" : "pt-8",
      `relative z-10 -mx-2 flex items-center gap-1 bg-background px-4 text-sm font-bold text-zinc-800 dark:text-neutral-400`,
    )

    if (view === FeedViewType.SocialMedia) {
      return <SocialMediaDateItem date={date} className={className} />
    }

    return (
      <div className={className}>
        <MarkAllButton
          className="size-7 text-base"
          filter={{
            startTime: startOfDay,
            endTime: endOfDay,
          }}
        />
        <RelativeDay date={dateObj} />
      </div>
    )
  },
)
