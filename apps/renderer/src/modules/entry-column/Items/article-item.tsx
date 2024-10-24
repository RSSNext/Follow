import { Skeleton } from "@follow/components/ui/skeleton/index.jsx"

import { RelativeTime } from "~/components/ui/datetime"
import { Media } from "~/components/ui/media"
import { ListItem } from "~/modules/entry-column/templates/list-item-template"
import { FeedIcon } from "~/modules/feed/feed-icon"

import type { EntryItemStatelessProps, UniversalItemProps } from "../types"

export function ArticleItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  return (
    <ListItem entryId={entryId} entryPreview={entryPreview} translation={translation} withDetails />
  )
}

export function ArticleItemStateLess({ entry, feed }: EntryItemStatelessProps) {
  return (
    <div className="relative rounded-md text-zinc-700 transition-colors dark:text-neutral-400">
      <div className="relative">
        <div className="group relative flex py-4 pl-3 pr-2">
          <FeedIcon className="mr-2 size-5 rounded-sm" feed={feed} fallback />
          <div className="-mt-0.5 line-clamp-4 flex-1 text-sm leading-tight">
            <div className="flex gap-1 text-[10px] font-bold text-zinc-400 dark:text-neutral-500">
              <span>{feed.title}</span>
              <span>·</span>
              <span>{!!entry.publishedAt && <RelativeTime date={entry.publishedAt} />}</span>
            </div>
            <div className="relative my-1 break-words font-medium">{entry.title}</div>
            <div className="mt-1.5 text-[13px] text-zinc-400 dark:text-neutral-500">
              {entry.description}
            </div>
          </div>
          {entry.media?.[0] ? (
            <Media
              thumbnail
              src={entry.media[0].url}
              type={entry.media[0].type}
              previewImageUrl={entry.media[0].preview_image_url}
              className="ml-2 size-20 overflow-hidden rounded"
              mediaContainerClassName={"w-auto h-auto rounded"}
              loading="lazy"
              proxy={{
                width: 160,
                height: 160,
              }}
              height={entry.media[0].height}
              width={entry.media[0].width}
              blurhash={entry.media[0].blurhash}
            />
          ) : (
            <Skeleton className="ml-2 size-20 overflow-hidden rounded" />
          )}
        </div>
      </div>
    </div>
  )
}

export const ArticleItemSkeleton = (
  <div className="relative h-[120px] rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative">
      <div className="group relative flex py-4 pl-3 pr-2">
        <Skeleton className="mr-2 size-5 rounded-sm" />
        <div className="-mt-0.5 flex-1 text-sm leading-tight">
          <div className="flex gap-1 text-[10px] font-bold text-zinc-400 dark:text-neutral-500">
            <Skeleton className="h-3 w-24" />
            <span>·</span>
            <Skeleton className="h-3 w-12 shrink-0" />
          </div>
          <div className="relative my-1 break-words font-medium">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="mt-1 h-3.5 w-3/4" />
          </div>
          <div className="mt-1.5 text-[13px] text-zinc-400 dark:text-neutral-500">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-4/5" />
          </div>
        </div>
        <Skeleton className="ml-2 size-20 overflow-hidden rounded" />
      </div>
    </div>
  </div>
)
