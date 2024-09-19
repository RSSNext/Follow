import dayjs from "dayjs"

import { FeedIcon } from "~/components/feed-icon"
import { TitleMarquee } from "~/components/ui/marquee"
import { ReactVirtuosoItemPlaceholder } from "~/components/ui/placeholder"
import { useAsRead } from "~/hooks/biz/useAsRead"
import { cn } from "~/lib/utils"
import { EntryTranslation } from "~/modules/entry-column/translation"
import { useEntry } from "~/store/entry/hooks"
import { getPreferredTitle, useFeedById } from "~/store/feed"

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
      <div className={cn("relative px-2 py-1 text-sm")}>
        <div className="flex items-center">
          <div
            className={cn(
              "mr-1 size-1.5 shrink-0 self-center rounded-full bg-accent duration-200",
              asRead && "mr-0 w-0",
            )}
          />
          <div
            className={cn(
              "relative mb-1 mt-1.5 flex w-full items-center gap-1 truncate font-medium leading-none",
              !!entry.collections && "pr-5",
            )}
          >
            <TitleMarquee className="min-w-0 grow">
              <EntryTranslation source={entry.entries.title} target={translation?.title} />
            </TitleMarquee>
            {!!entry.collections && <StarIcon className="static shrink-0 self-end" />}
          </div>
        </div>
        <div className="flex items-center gap-1 truncate text-[13px]">
          <FeedIcon
            fallback
            className="mr-0.5 flex"
            feed={feeds!}
            entry={entry.entries}
            size={18}
          />
          <span className="min-w-0 truncate">{getPreferredTitle(feeds)}</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-500">
            {dayjs
              .duration(dayjs(entry.entries.publishedAt).diff(dayjs(), "minute"), "minute")
              .humanize()}
          </span>
        </div>
      </div>
    </div>
  )
}
