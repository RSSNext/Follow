import { Skeleton } from "@follow/components/ui/skeleton/index.jsx"

import { RelativeTime } from "~/components/ui/datetime"
import { ListItem } from "~/modules/entry-column/templates/list-item-template"
import { FeedIcon } from "~/modules/feed/feed-icon"

import type { EntryItemStatelessProps, UniversalItemProps } from "../types"

export function NotificationItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  return (
    <ListItem entryId={entryId} entryPreview={entryPreview} translation={translation} withFollow />
  )
}

export function NotificationItemStateLess({ entry, feed }: EntryItemStatelessProps) {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="group relative flex py-4 pl-3 pr-2">
        <FeedIcon feed={feed} fallback />

        <div className="-mt-0.5 line-clamp-4 flex-1 text-sm leading-tight">
          <div className="flex gap-1 text-[10px] font-bold text-zinc-400 dark:text-neutral-500">
            <span>{feed.title}</span>
            <span>·</span>
            <span>{!!entry.publishedAt && <RelativeTime date={entry.publishedAt} />}</span>
          </div>
          <div className="relative my-0.5 break-words">{entry.title}</div>
        </div>
      </div>
    </div>
  )
}

export const NotificationItemSkeleton = (
  <div className="relative mx-auto w-full max-w-lg">
    <div className="group relative flex py-4 pl-3 pr-2">
      <Skeleton className="mr-2 size-5 shrink-0 overflow-hidden rounded-sm " />
      <div className="-mt-0.5 line-clamp-4 flex-1 text-sm leading-tight">
        <div className="flex gap-1 text-[10px] font-bold text-zinc-400 dark:text-neutral-500">
          <Skeleton className="h-3 w-32 truncate " />
          <span>·</span>
          <Skeleton className="h-3 w-12 shrink-0 " />
        </div>
        <div className="relative my-0.5 break-words">
          <Skeleton className="h-4 w-full " />
          <Skeleton className="mt-2 h-4 w-3/4 " />
        </div>
      </div>
    </div>
  </div>
)
