import { FeedIcon } from "@renderer/components/feed-icon"
import { Image } from "@renderer/components/ui/image"
import { useAsRead } from "@renderer/hooks/biz/useAsRead"
import {
  useRouteParamsSelector,
} from "@renderer/hooks/biz/useRouteParams"
import { FEED_COLLECTION_LIST } from "@renderer/lib/constants"
import dayjs from "@renderer/lib/dayjs"
import { cn } from "@renderer/lib/utils"
import { EntryTranslation } from "@renderer/modules/entry-column/translation"
import { useEntry } from "@renderer/store/entry/hooks"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import { StarIcon } from "./star-icon"
import type { UniversalItemProps } from "./types"

export function ListItem({
  entryId,
  entryPreview,
  translation,
  withDetails,
  withAudio,
}: UniversalItemProps & {
  withDetails?: boolean
  withAudio?: boolean
}) {
  const entry = useEntry(entryId) || entryPreview

  const asRead = useAsRead(entry)

  const inInCollection = useRouteParamsSelector(
    (s) => s.feedId === FEED_COLLECTION_LIST,
  )
  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry) return <ReactVirtuosoItemPlaceholder />

  return (
    <div
      className={cn(
        "relative flex py-3 pl-3 pr-2",
        !asRead &&
        "before:absolute before:-left-0.5 before:top-[18px] before:block before:size-2 before:rounded-full before:bg-theme-accent",
      )}
    >
      <FeedIcon feed={entry.feeds} entry={entry.entries} />
      <div className="-mt-0.5 line-clamp-4 flex-1 text-sm leading-tight">
        <div
          className={cn(
            "flex gap-1 text-[10px] font-bold",
            asRead ? "text-zinc-400" : "text-zinc-500",
            entry.collections && "text-zinc-600 dark:text-zinc-500",
          )}
        >
          <span className="truncate">{entry.feeds.title}</span>
          <span>·</span>
          <span className="shrink-0">
            {dayjs
              .duration(
                dayjs(
                  inInCollection ?
                    entry.collections?.createdAt :
                    entry.entries.publishedAt,
                ).diff(dayjs(), "minute"),
                "minute",
              )
              .humanize()}
          </span>
        </div>
        <div
          className={cn(
            "relative my-0.5 break-words",
            !!entry.collections && "pr-5",
            entry.entries.title ? withDetails && "font-medium" : "text-[13px]",
          )}
        >
          {entry.entries.title ? (
            <EntryTranslation
              source={entry.entries.title}
              target={translation?.title}
            />
          ) : (
            <EntryTranslation
              source={entry.entries.description}
              target={translation?.description}
            />
          )}
          {!!entry.collections && <StarIcon />}
        </div>
        {withDetails && (
          <div
            className={cn(
              "text-[13px]",
              asRead ?
                "text-zinc-400 dark:text-neutral-500" :
                "text-zinc-500 dark:text-neutral-400",
            )}
          >
            <EntryTranslation
              source={entry.entries.description}
              target={translation?.description}
            />
          </div>
        )}
        {withAudio && entry.entries?.enclosures?.[0].url && (
          <audio
            className="mt-2 h-10 w-full"
            controls
            src={entry.entries?.enclosures?.[0].url}
          />
        )}
      </div>
      {withDetails && entry.entries.images?.[0] && (
        <Image
          src={entry.entries.images[0]}
          className="ml-2 size-20 shrink-0"
          loading="lazy"
          proxy={{
            width: 160,
            height: 160,
          }}
        />
      )}
    </div>
  )
}
