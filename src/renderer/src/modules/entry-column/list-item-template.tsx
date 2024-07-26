import { Player, usePlayerAtomValue } from "@renderer/atoms/player"
import { FeedIcon } from "@renderer/components/feed-icon"
import { RelativeTime } from "@renderer/components/ui/datetime"
import { Media } from "@renderer/components/ui/media"
import { FEED_COLLECTION_LIST } from "@renderer/constants"
import { useAsRead } from "@renderer/hooks/biz/useAsRead"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { cn } from "@renderer/lib/utils"
import { EntryTranslation } from "@renderer/modules/entry-column/translation"
import { useEntry } from "@renderer/store/entry/hooks"
import { useFeedById } from "@renderer/store/feed"
import { useState } from "react"

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

  const feed = useFeedById(entry?.feedId) || entryPreview?.feeds

  const [isHovered, setIsHovered] = useState(false)

  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry || !feed) return <ReactVirtuosoItemPlaceholder />

  const displayTime = inInCollection ?
    entry.collections?.createdAt :
    entry.entries.publishedAt
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex py-3 pl-3 pr-2",
        !asRead &&
        "before:absolute before:-left-0.5 before:top-[18px] before:block before:size-2 before:rounded-full before:bg-theme-accent",
      )}
    >
      {!withAudio && <FeedIcon feed={feed} entry={entry.entries} />}
      <div className="-mt-0.5 line-clamp-4 flex-1 text-sm leading-tight">
        <div
          className={cn(
            "flex gap-1 text-[10px] font-bold",
            asRead ?
              "text-zinc-400 dark:text-neutral-500" :
              "text-zinc-500 dark:text-zinc-400",
            entry.collections && "text-zinc-600 dark:text-zinc-500",
          )}
        >
          <span className="truncate">{feed.title}</span>
          <span>·</span>
          <span className="shrink-0">
            {!!displayTime && <RelativeTime date={displayTime} />}
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
      </div>

      {withAudio && entry.entries?.attachments?.[0].url && (
        <AudioCover
          entryId={entryId}
          src={entry.entries?.attachments?.[0].url}
          durationInSeconds={Number.parseInt(String(entry.entries?.attachments?.[0].duration_in_seconds ?? 0), 10)}
          feedIcon={<FeedIcon feed={feed} entry={entry.entries} size={80} />}
          isHovered={isHovered}
        />
      )}

      {withDetails && entry.entries.media?.[0] && (
        <Media
          src={entry.entries.media[0].url}
          type={entry.entries.media[0].type}
          previewImageUrl={entry.entries.media[0].preview_image_url}
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

function AudioCover({
  entryId,
  src,
  durationInSeconds,
  feedIcon,
  isHovered,
}: {
  entryId: string
  src: string
  durationInSeconds?: number
  feedIcon: React.ReactNode
  isHovered: boolean
}) {
  const playerValue = usePlayerAtomValue()

  const isMeActive = playerValue.src === src
  const shouldShowPlayButton = isHovered || isMeActive

  const estimatedMins = durationInSeconds ? Math.floor(durationInSeconds / 60) : undefined

  const handleClickPlay = () => {
    if (!isMeActive) {
      // switch this to play
      Player.play({
        type: "audio",
        entryId,
        src,
        duration: durationInSeconds,
        currentTime: 0,
      })
    } else {
      // switch between play and pause
      Player.togglePlayAndPause()
    }
  }

  return (
    <div className="relative ml-2 size-20 shrink-0">
      {feedIcon}

      <div
        className={cn("center absolute inset-0 w-full transition-all duration-200 ease-in-out", shouldShowPlayButton ? "opacity-100" : "opacity-0")}
        onClick={handleClickPlay}
      >
        <button
          type="button"
          className="center size-10 rounded-full bg-theme-background opacity-95 hover:bg-theme-accent hover:opacity-100"
        >
          <i
            className={cn("size-6", {
              "i-mingcute-pause-fill":
                isMeActive && playerValue.status === "playing",
              "i-mingcute-loading-fill animate-spin":
                isMeActive && playerValue.status === "loading",
              "i-mingcute-play-fill":
                !isMeActive || playerValue.status === "paused",
            })}
          />
        </button>
      </div>

      <div className="absolute bottom-0 w-full bg-theme-background text-center text-[13px] opacity-50">
        {estimatedMins ? `${estimatedMins} m` : "- m"}
      </div>
    </div>
  )
}
