import { useMemo } from "react"

import { useWhoami } from "~/atoms/user"
import { FeedIcon } from "~/components/feed-icon"
import { RelativeTime } from "~/components/ui/datetime"
import { useAuthQuery } from "~/hooks/common"
import { cn } from "~/lib/utils"
import type { FeedModel } from "~/models"
import { Queries } from "~/queries"
import { useEntry, useEntryReadHistory } from "~/store/entry"
import { getPreferredTitle, useFeedById } from "~/store/feed"

import { EntryTranslation } from "../../entry-column/translation"

interface EntryLinkProps {
  entryId: string
  compact?: boolean
}

const safeUrl = (url: string, baseUrl: string) => {
  try {
    return new URL(url, baseUrl).href
  } catch {
    return url
  }
}

export const EntryTitle = ({ entryId, compact }: EntryLinkProps) => {
  const user = useWhoami()
  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId) as FeedModel
  const entryHistory = useEntryReadHistory(entryId)

  const populatedFullHref = useMemo(() => {
    const href = entry?.entries.url
    if (!href) return "#"

    if (href.startsWith("http")) return href
    const feedSiteUrl = feed?.siteUrl
    if (href.startsWith("/") && feedSiteUrl) return safeUrl(href, feedSiteUrl)
    return href
  }, [entry?.entries.url, feed?.siteUrl])

  const translation = useAuthQuery(
    Queries.ai.translation({
      entry: entry!,
      language: entry?.settings?.translation,
      extraFields: ["title"],
    }),
    {
      enabled: !!entry?.settings?.translation,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      meta: {
        persist: true,
      },
    },
  )

  if (!entry) return null

  return compact ? (
    <div className="-mx-6 flex cursor-button items-center gap-2 rounded-lg p-6 transition-colors @sm:-mx-3 @sm:p-3">
      <FeedIcon fallback feed={feed} entry={entry.entries} size={50} />
      <div className="leading-6">
        <div className="flex items-center gap-1 text-base font-semibold">
          <span>{entry.entries.author || feed.title}</span>
        </div>
        <div className="text-zinc-500">
          <RelativeTime date={entry.entries.publishedAt} />
        </div>
      </div>
    </div>
  ) : (
    <a
      href={populatedFullHref || void 0}
      target="_blank"
      className="-mx-6 block cursor-button rounded-lg p-6 transition-colors hover:bg-theme-item-hover focus-visible:bg-theme-item-hover focus-visible:!outline-none @sm:-mx-3 @sm:p-3"
      rel="noreferrer"
    >
      <div className={cn("select-text break-words font-bold", compact ? "text-2xl" : "text-3xl")}>
        <EntryTranslation
          source={entry.entries.title}
          target={translation.data?.title}
          useOverlay
        />
      </div>
      <div className="mt-2 text-[13px] font-medium text-zinc-500">{getPreferredTitle(feed)}</div>
      <div className="flex items-center gap-2 text-[13px] text-zinc-500">
        {entry.entries.publishedAt && new Date(entry.entries.publishedAt).toLocaleString()}

        <div className="flex items-center gap-1">
          <i className="i-mgc-eye-2-cute-re" />
          <span>
            {(
              (entryHistory?.readCount ?? 0) +
              (entryHistory?.userIds?.every((id) => id !== user?.id) ? 1 : 0)
            ) // if no me, +1
              .toLocaleString()}
          </span>
        </div>
      </div>
    </a>
  )
}
