import { RelativeTime } from "@follow/components/ui/datetime/index.jsx"
import { FeedIcon } from "@follow/components/ui/feed-icon/index.jsx"
import { EllipsisHorizontalTextWithTooltip } from "@follow/components/ui/typography/index.js"
import { cn } from "@follow/utils/utils"

import type { UniversalItemProps } from "./types"

export function NormalListItem({
  entryPreview,

  withDetails,
}: UniversalItemProps & {
  withDetails?: boolean
}) {
  const entry = entryPreview

  const feed = entryPreview?.feeds

  if (!entry || !feed) return null
  const displayTime = entry.entries.publishedAt

  return (
    <div className={"group relative flex cursor-menu pl-3 pr-2"}>
      <FeedIcon feed={feed} fallback entry={entry.entries} />
      <div className={"-mt-0.5 flex-1 text-sm leading-tight"}>
        <div
          className={cn(
            "flex gap-1 text-[10px] font-bold",
            "text-zinc-400 dark:text-neutral-500",
            entry.collections && "text-zinc-600 dark:text-zinc-500",
          )}
        >
          <EllipsisHorizontalTextWithTooltip className="truncate">
            {feed?.title}
          </EllipsisHorizontalTextWithTooltip>
          <span>·</span>
          <span className="shrink-0">{!!displayTime && <RelativeTime date={displayTime} />}</span>
        </div>
        <div
          className={cn(
            "relative my-0.5 break-words",
            !!entry.collections && "pr-5",
            entry.entries.title ? withDetails && "font-medium" : "text-[13px]",
          )}
        >
          {entry.entries.title}

          {/* {!!entry.collections && <StarIcon className="absolute right-0 top-0" />} */}
        </div>
        {withDetails && (
          <div className={cn("text-[13px]", "text-zinc-400 dark:text-neutral-500")}>
            {entry.entries.description}
          </div>
        )}
      </div>

      {withDetails && entry.entries.media?.[0] && (
        // <Media
        //   thumbnail
        //   src={entry.entries.media[0].url}
        //   type={entry.entries.media[0].type}
        //   previewImageUrl={entry.entries.media[0].preview_image_url}
        //   className={cn("center ml-2 flex shrink-0 rounded", "size-20")}
        //   mediaContainerClassName={"w-auto h-auto rounded"}
        //   loading="lazy"
        //   proxy={{
        //     width: 160,
        //     height: 160,
        //   }}
        //   height={entry.entries.media[0].height}
        //   width={entry.entries.media[0].width}
        //   blurhash={entry.entries.media[0].blurhash}
        // />
        <img />
      )}
    </div>
  )
}
