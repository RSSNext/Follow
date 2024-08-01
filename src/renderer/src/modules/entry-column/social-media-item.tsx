import { Slot } from "@radix-ui/react-slot"
import { FeedIcon } from "@renderer/components/feed-icon"
import { ActionButton } from "@renderer/components/ui/button"
import { RelativeTime } from "@renderer/components/ui/datetime"
import { Media } from "@renderer/components/ui/media"
import { usePreviewMedia } from "@renderer/components/ui/media/hooks"
import { Skeleton } from "@renderer/components/ui/skeleton"
import { useAsRead } from "@renderer/hooks/biz/useAsRead"
import { useEntryActions } from "@renderer/hooks/biz/useEntryActions"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry/hooks"
import { useFeedById } from "@renderer/store/feed"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import { StarIcon } from "./star-icon"
import { EntryTranslation } from "./translation"
import type { EntryListItemFC } from "./types"

export const SocialMediaItem: EntryListItemFC = ({
  entryId,
  entryPreview,
  translation,
}) => {
  const entry = useEntry(entryId) || entryPreview

  const previewMedia = usePreviewMedia()
  const asRead = useAsRead(entry)
  const feed = useFeedById(entry?.feedId)
  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry || !feed) return <ReactVirtuosoItemPlaceholder />

  return (
    <div
      className={cn(
        "relative flex py-4 pl-3 pr-2",
        "group",
        !asRead &&
        "before:absolute before:-left-4 before:top-[22px] before:block before:size-2 before:rounded-full before:bg-theme-accent",
      )}
    >
      <FeedIcon
        fallback
        className="mask-squircle mask"
        feed={feed}
        entry={entry.entries}
        size={36}
      />
      <div className="ml-2 min-w-0 flex-1">
        <div
          className={cn(
            "-mt-0.5 flex-1 text-sm",
            entry.entries.description && "line-clamp-5",
          )}
        >
          <div className="w-[calc(100%-10rem)]  space-x-1">
            <span className="font-semibold">{entry.entries.author}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              <RelativeTime date={entry.entries.publishedAt} />
            </span>
          </div>
          <div
            className={cn(
              "relative mt-0.5 whitespace-pre-line text-base",
              !!entry.collections && "pr-5",
            )}
          >
            <EntryTranslation
              source={entry.entries.description}
              target={translation?.description}
            />
            {!!entry.collections && <StarIcon />}
          </div>
        </div>
        <div className="mt-1 flex gap-2 overflow-x-auto">
          {entry.entries.media?.map((media, i, mediaList) => (
            <Media
              key={media.url}
              src={media.url}
              type={media.type}
              previewImageUrl={media.preview_image_url}
              className="size-28 shrink-0"
              loading="lazy"
              proxy={{
                width: 224,
                height: 224,
              }}
              onClick={(e) => {
                e.stopPropagation()
                previewMedia(mediaList, i)
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={cn(
          "absolute right-1 top-1.5",
          "invisible opacity-0 duration-200 group-hover:visible group-hover:opacity-80",
        )}
      >
        <ActionBar entryId={entryId} />
      </div>
    </div>
  )
}

SocialMediaItem.wrapperClassName = tw`w-[75ch] m-auto`

const ActionBar = ({ entryId }: { entryId: string }) => {
  const entry = useEntry(entryId)
  const view = useRouteParamsSelector((s) => s.view)
  const { items } = useEntryActions({
    entry,
    view,
  })
  return (
    <div className="flex origin-right scale-90 items-center gap-1">
      {items
        .filter(
          (item) =>
            !item.disabled && item.key !== "read" && item.key !== "unread",
        )
        .map((item) => (
          <ActionButton
            icon={
              item.icon ? (
                <Slot className="size-4">{item.icon}</Slot>
              ) : (
                <i className={item.className} />
              )
            }
            onClick={item.onClick}
            tooltip={item.name}
            key={item.name}
          />
        ))}
    </div>
  )
}

export const SocialMediaItemSkeleton = (
  <div className="relative m-auto w-[75ch] rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative z-[1]">
      <div className="group relative flex py-4 pl-3 pr-2">
        <Skeleton className="mr-2 size-9" />
        <div className="ml-2 min-w-0 flex-1">
          <div className="-mt-0.5 line-clamp-5 flex-1 text-sm">
            <div className="flex w-[calc(100%-10rem)] space-x-1">
              <Skeleton className="h-4 w-16 " />
              <span className="text-zinc-500">·</span>
              <Skeleton className="h-4 w-12 " />
            </div>
            <div className="relative mt-0.5 whitespace-pre-line text-base">
              <Skeleton className="h-4 w-full " />
              <Skeleton className="mt-1.5 h-4 w-full " />
              <Skeleton className="mt-1.5 h-4 w-3/4 " />
            </div>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto">
            <Skeleton className="size-28 overflow-hidden rounded " />
          </div>
        </div>
      </div>
    </div>
  </div>
)
