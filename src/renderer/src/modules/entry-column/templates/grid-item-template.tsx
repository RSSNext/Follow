import { FeedIcon } from "@renderer/components/feed-icon"
import { TitleMarquee } from "@renderer/components/ui/marquee"
import { ReactVirtuosoItemPlaceholder } from "@renderer/components/ui/placeholder"
import { useAsRead } from "@renderer/hooks/biz/useAsRead"
import { cn } from "@renderer/lib/utils"
import { EntryTranslation } from "@renderer/modules/entry-column/translation"
import { useEntry } from "@renderer/store/entry/hooks"
import { useFeedById } from "@renderer/store/feed"
import dayjs from "dayjs"

import { StarIcon } from "../star-icon"
import type { UniversalItemProps } from "../types"

export function GridItem({
  entryId,
  entryPreview,
  translation,
  children,
  wrapperClassName,
}: UniversalItemProps & {
  children?: React.ReactNode
  wrapperClassName?: string
}) {
  const entry = useEntry(entryId) || entryPreview
  const feeds = useFeedById(entry?.feedId)

  const asRead = useAsRead(entry)

  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <div className={cn("p-1.5", wrapperClassName)}>
      {children}
      <div
        className={cn(
          "relative flex-1 px-2 py-1 text-sm",
          !asRead &&
          "before:absolute before:-left-0.5 before:top-[14.5px] before:block before:size-1.5 before:rounded-full before:bg-theme-accent",
        )}
      >
        <div
          className={cn(
            "relative mb-1 mt-1.5 truncate font-medium leading-none",
            !!entry.collections && "pr-5",
          )}
        >
          <TitleMarquee>
            <EntryTranslation
              source={entry.entries.title}
              target={translation?.title}
            />
          </TitleMarquee>
          {!!entry.collections && <StarIcon />}
        </div>
        <div className="flex items-center gap-1 truncate text-[13px]">
          <FeedIcon
            fallback
            className="mr-0.5 flex"
            feed={feeds!}
            entry={entry.entries}
            size={18}
          />
          <span className="min-w-0 truncate">{feeds?.title}</span>
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
      </div>
    </div>
  )
}
