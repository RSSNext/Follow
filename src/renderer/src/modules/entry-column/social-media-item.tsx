import { FeedIcon } from "@renderer/components/feed-icon"
import { Image } from "@renderer/components/ui/image"
import { useAsRead } from "@renderer/hooks"
import dayjs from "@renderer/lib/dayjs"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry/hooks"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import { EntryTranslation } from "./translation"
import type { UniversalItemProps } from "./types"

export function SocialMediaItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  const asRead = useAsRead(entry)

  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <div className={cn("relative flex w-full py-3 pl-3 pr-2", !asRead && "before:absolute before:-left-0.5 before:top-[22px] before:block before:size-2 before:rounded-full before:bg-theme-accent")}>
      <FeedIcon feed={entry.feeds} entry={entry.entries} size={28} />
      <div className="min-w-0 flex-1">
        <div className="-mt-0.5 line-clamp-5 flex-1 text-sm">
          <div className="space-x-1">
            <span className="font-medium">{entry.entries.author}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              {dayjs
                .duration(
                  dayjs(entry.entries.publishedAt).diff(dayjs(), "minute"),
                  "minute",
                )
                .humanize()}
            </span>
          </div>
          <div className={cn("relative mt-0.5", !!entry.collections && "pr-4")}>
            <EntryTranslation source={entry.entries.description} target={translation?.description} />
            {!!entry.collections && (
              <i className="i-mgc-star-cute-fi absolute right-0 top-1 text-orange-400" />
            )}
          </div>
        </div>
        <div className="mt-1 flex gap-2 overflow-x-auto">
          {entry.entries.images?.map((image) => (
            <Image
              popper
              key={image}
              src={image}
              className="size-28 shrink-0"
              loading="lazy"
              proxy={{
                width: 224,
                height: 224,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
