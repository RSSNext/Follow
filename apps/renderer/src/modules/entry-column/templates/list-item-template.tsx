import { env } from "@follow/shared/env"
import { useDebounceCallback } from "usehooks-ts"

import { AudioPlayer, useAudioPlayerAtomSelector } from "~/atoms/player"
import { FeedIcon } from "~/components/feed-icon"
import { FollowIcon } from "~/components/icons/follow"
import { Button } from "~/components/ui/button"
import { RelativeTime } from "~/components/ui/datetime"
import { Media } from "~/components/ui/media"
import { useModalStack } from "~/components/ui/modal"
import { EllipsisHorizontalTextWithTooltip } from "~/components/ui/typography"
import { FEED_COLLECTION_LIST } from "~/constants"
import { useAsRead } from "~/hooks/biz/useAsRead"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { cn, isSafari } from "~/lib/utils"
import { FeedForm } from "~/modules/discover/feed-form"
import { EntryTranslation } from "~/modules/entry-column/translation"
import { Queries } from "~/queries"
import { useEntry } from "~/store/entry/hooks"
import { getPreferredTitle, useFeedById } from "~/store/feed"
import { useSubscriptionStore } from "~/store/subscription"

import { ReactVirtuosoItemPlaceholder } from "../../../components/ui/placeholder"
import { StarIcon } from "../star-icon"
import type { UniversalItemProps } from "../types"

export function ListItem({
  entryId,
  entryPreview,
  translation,
  withDetails,
  withAudio,
  withFollow,
}: UniversalItemProps & {
  withDetails?: boolean
  withAudio?: boolean
  withFollow?: boolean
}) {
  const entry = useEntry(entryId) || entryPreview

  const asRead = useAsRead(entry)

  const inInCollection = useRouteParamsSelector((s) => s.feedId === FEED_COLLECTION_LIST)

  const feed = useFeedById(entry?.feedId) || entryPreview?.feeds

  const handlePrefetchEntry = useDebounceCallback(
    () => {
      Queries.entries.byId(entryId).prefetch()
    },
    300,
    { leading: false },
  )

  const isSubscription = withFollow && entry?.entries.url?.startsWith(`${env.VITE_WEB_URL}/feed/`)
  const feedId = isSubscription
    ? entry?.entries.url?.replace(`${env.VITE_WEB_URL}/feed/`, "")
    : undefined
  const isFollowed = !!useSubscriptionStore((state) => feedId && state.data[feedId])
  const { present } = useModalStack()

  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry || !feed) return <ReactVirtuosoItemPlaceholder />

  const displayTime = inInCollection ? entry.collections?.createdAt : entry.entries.publishedAt
  const envIsSafari = isSafari()
  return (
    <div
      onMouseEnter={handlePrefetchEntry}
      onMouseLeave={handlePrefetchEntry.cancel}
      className={cn(
        "group relative flex cursor-menu py-4 pl-3 pr-2",
        !asRead &&
          "before:absolute before:-left-0.5 before:top-[1.4375rem] before:block before:size-2 before:rounded-full before:bg-accent",
      )}
    >
      {!withAudio && <FeedIcon feed={feed} fallback entry={entry.entries} />}
      <div
        className={cn(
          "-mt-0.5 flex-1 text-sm leading-tight",

          // FIXME: Safari bug, not support line-clamp cross elements
          !envIsSafari && "line-clamp-4",
        )}
      >
        <div
          className={cn(
            "flex gap-1 text-[10px] font-bold",
            asRead ? "text-zinc-400 dark:text-neutral-500" : "text-zinc-500 dark:text-zinc-400",
            entry.collections && "text-zinc-600 dark:text-zinc-500",
          )}
        >
          <EllipsisHorizontalTextWithTooltip className="truncate">
            {getPreferredTitle(feed)}
          </EllipsisHorizontalTextWithTooltip>
          <span>·</span>
          <span className="shrink-0">{!!displayTime && <RelativeTime date={displayTime} />}</span>
        </div>
        <div
          className={cn(
            "relative my-0.5 break-words",
            !!entry.collections && "pr-5",
            entry.entries.title ? (withDetails || withAudio) && "font-medium" : "text-[13px]",
          )}
        >
          {entry.entries.title ? (
            <EntryTranslation
              useOverlay
              side="top"
              className={envIsSafari ? "line-clamp-2 break-all" : undefined}
              source={entry.entries.title}
              target={translation?.title}
            />
          ) : (
            <EntryTranslation
              useOverlay
              side="top"
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
              asRead
                ? "text-zinc-400 dark:text-neutral-500"
                : "text-zinc-500 dark:text-neutral-400",
            )}
          >
            <EntryTranslation
              useOverlay
              side="top"
              className={envIsSafari ? "line-clamp-2 break-all" : undefined}
              source={entry.entries.description}
              target={translation?.description}
            />
          </div>
        )}
      </div>

      {feedId && !isFollowed && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            present({
              title: `${APP_NAME}`,
              clickOutsideToDismiss: true,
              content: ({ dismiss }) => <FeedForm asWidget id={feedId} onSuccess={dismiss} />,
            })
          }}
          variant="outline"
          className="h-8"
        >
          <>
            <FollowIcon className="mr-1 size-3" />
            {APP_NAME}
          </>
        </Button>
      )}

      {withAudio && entry.entries?.attachments?.[0].url && (
        <AudioCover
          entryId={entryId}
          src={entry.entries?.attachments?.[0].url}
          durationInSeconds={Number.parseInt(
            String(entry.entries?.attachments?.[0].duration_in_seconds ?? 0),
            10,
          )}
          feedIcon={
            <FeedIcon
              fallback={false}
              feed={feed}
              entry={entry.entries}
              size={80}
              className="m-0 rounded"
              useMedia
            />
          }
        />
      )}

      {withDetails && entry.entries.media?.[0] && (
        <Media
          thumbnail
          src={entry.entries.media[0].url}
          type={entry.entries.media[0].type}
          previewImageUrl={entry.entries.media[0].preview_image_url}
          className="center ml-2 flex size-20 max-w-20 shrink-0 rounded"
          mediaContainerClassName={"w-auto h-auto rounded"}
          loading="lazy"
          proxy={{
            width: 160,
            height: 160,
          }}
          height={entry.entries.media[0].height}
          width={entry.entries.media[0].width}
          blurhash={entry.entries.media[0].blurhash}
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
}: {
  entryId: string
  src: string
  durationInSeconds?: number
  feedIcon: React.ReactNode
}) {
  const playStatus = useAudioPlayerAtomSelector((playerValue) =>
    playerValue.src === src && playerValue.show ? playerValue.status : false,
  )

  const estimatedMins = durationInSeconds ? Math.floor(durationInSeconds / 60) : undefined

  const handleClickPlay = () => {
    if (!playStatus) {
      // switch this to play
      AudioPlayer.mount({
        type: "audio",
        entryId,
        src,
        currentTime: 0,
      })
    } else {
      // switch between play and pause
      AudioPlayer.togglePlayAndPause()
    }
  }

  return (
    <div className="relative ml-2 shrink-0">
      {feedIcon}

      <div
        className={cn(
          "center absolute inset-0 w-full transition-all duration-200 ease-in-out group-hover:-translate-y-2 group-hover:opacity-100",
          playStatus ? "opacity-100" : "opacity-0",
        )}
        onClick={handleClickPlay}
      >
        <button
          type="button"
          className="center size-10 rounded-full bg-theme-background opacity-95 hover:bg-accent hover:text-white hover:opacity-100"
        >
          <i
            className={cn("size-6", {
              "i-mingcute-pause-fill": playStatus && playStatus === "playing",
              "i-mingcute-loading-fill animate-spin": playStatus && playStatus === "loading",
              "i-mingcute-play-fill": !playStatus || playStatus === "paused",
            })}
          />
        </button>
      </div>

      {!!estimatedMins && (
        <div className="absolute bottom-0 w-full overflow-hidden rounded-b-sm text-center ">
          <div className="absolute left-0 top-0 size-full bg-white/50 opacity-0 duration-200 group-hover:opacity-100 dark:bg-neutral-900/70" />
          <div className="text-[13px] opacity-0 backdrop-blur-none duration-200 group-hover:opacity-100 group-hover:backdrop-blur-sm">
            {formatEstimatedMins(estimatedMins)}
          </div>
        </div>
      )}
    </div>
  )
}
const formatEstimatedMins = (estimatedMins: number) => {
  const minutesInHour = 60
  const minutesInDay = minutesInHour * 24
  const minutesInMonth = minutesInDay * 30

  const months = Math.floor(estimatedMins / minutesInMonth)
  const days = Math.floor((estimatedMins % minutesInMonth) / minutesInDay)
  const hours = Math.floor((estimatedMins % minutesInDay) / minutesInHour)
  const minutes = estimatedMins % minutesInHour

  if (months > 0) {
    return `${months}M ${days}d`
  }
  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${estimatedMins} mins`
}
