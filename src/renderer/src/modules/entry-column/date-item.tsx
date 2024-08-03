import { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"

import { MarkAllButton } from "./mark-all-button"
import { SocialMediaDateItem } from "./social-media-item"

export const DateItem = ({
  date,
  view,
  isFirst,
}: {
  date: string
  view: FeedViewType
  isFirst: boolean
}) => {
  const dateObj = new Date(date)
  const dateString = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0)).getTime()
  const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999)).getTime()

  const className = cn(!isFirst && "pt-10", "flex items-center gap-1 pl-2 text-sm font-bold text-zinc-800 dark:text-neutral-400")

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
      {dateString}
    </div>
  )
}
