import { Slot } from "@radix-ui/react-slot"
import { atom } from "jotai"
import { useLayoutEffect, useRef } from "react"

import { FeedIcon } from "~/components/feed-icon"
import { ActionButton } from "~/components/ui/button"
import { RelativeTime } from "~/components/ui/datetime"
import { Media } from "~/components/ui/media"
import { usePreviewMedia } from "~/components/ui/media/hooks"
import { Skeleton } from "~/components/ui/skeleton"
import { useAsRead } from "~/hooks/biz/useAsRead"
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { getImageProxyUrl } from "~/lib/img-proxy"
import { jotaiStore } from "~/lib/jotai"
import { parseSocialMedia } from "~/lib/parsers"
import { cn, filterSmallMedia } from "~/lib/utils"
import { useEntry } from "~/store/entry/hooks"
import { useFeedById } from "~/store/feed"

import { ReactVirtuosoItemPlaceholder } from "../../../components/ui/placeholder"
import { StarIcon } from "../star-icon"
import { EntryTranslation } from "../translation"
import type { EntryItemStatelessProps, EntryListItemFC } from "../types"

const socialMediaContentWidthAtom = atom(0)
export const SocialMediaItem: EntryListItemFC = ({ entryId, entryPreview, translation }) => {
  const entry = useEntry(entryId) || entryPreview

  const previewMedia = usePreviewMedia()
  const asRead = useAsRead(entry)
  const feed = useFeedById(entry?.feedId)

  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      jotaiStore.set(socialMediaContentWidthAtom, ref.current.offsetWidth)
    }
  }, [ref.current])
  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry || !feed) return <ReactVirtuosoItemPlaceholder />

  const content = entry.entries.content || entry.entries.description

  const parsed = parseSocialMedia(entry.entries)

  const media = filterSmallMedia(entry.entries.media)

  return (
    <div
      className={cn(
        "relative flex px-8 py-6",
        "group",
        !asRead &&
          "before:absolute before:left-2 before:top-10 before:block before:size-2 before:rounded-full before:bg-accent",
      )}
    >
      <FeedIcon fallback feed={feed} entry={entry.entries} size={32} className="mt-1" />
      <div ref={ref} className="ml-2 min-w-0 flex-1">
        <div className="-mt-0.5 flex-1 text-sm">
          <div className="w-[calc(100%-10rem)] space-x-1 leading-6">
            <span className="inline-flex items-center gap-1 text-base font-semibold">
              <span>{entry.entries.author || feed.title}</span>
              {parsed?.type === "x" && (
                <i className="i-mgc-twitter-cute-fi size-3 text-[#4A99E9]" />
              )}
            </span>

            {parsed?.type === "x" && (
              <a
                href={`https://x.com/${parsed.meta.handle}`}
                target="_blank"
                className="text-zinc-500"
              >
                @{parsed.meta.handle}
              </a>
            )}
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              <RelativeTime date={entry.entries.publishedAt} />
            </span>
          </div>
          <div className={cn("relative mt-1 text-base", !!entry.collections && "pr-5")}>
            <EntryTranslation
              className="cursor-auto select-text text-sm leading-relaxed prose-blockquote:mt-0 [&_br:last-child]:hidden"
              source={content}
              target={translation?.content}
              isHTML
            />
            {!!entry.collections && <StarIcon className="absolute right-0 top-0" />}
          </div>
        </div>
        {!!media?.length && (
          <div className="mt-4 flex gap-[8px] overflow-x-auto pb-2">
            {media.map((media, i, mediaList) => {
              const style: Partial<{
                width: string
                height: string
              }> = {}
              const boundsWidth = jotaiStore.get(socialMediaContentWidthAtom)
              if (media.height && media.width) {
                // has 1 picture, max width is container width, but max height is less than window height: 2/3
                if (mediaList.length === 1) {
                  style.width = `${boundsWidth}px`
                  style.height = `${(boundsWidth * media.height) / media.width}px`
                  if (Number.parseInt(style.height) > (window.innerHeight * 2) / 3) {
                    style.height = `${(window.innerHeight * 2) / 3}px`
                    style.width = `${(Number.parseInt(style.height) * media.width) / media.height}px`
                  }
                }
                // has 2 pictures, max width is container half width, and - gap 8px
                else if (mediaList.length === 2) {
                  style.width = `${(boundsWidth - 8) / 2}px`
                  style.height = `${(((boundsWidth - 8) / 2) * media.height) / media.width}px`
                }
                // has over 2 pictures, max width is container 1/3 width
                else if (mediaList.length > 2) {
                  style.width = `${boundsWidth / 3}px`
                  style.height = `${((boundsWidth / 3) * media.height) / media.width}px`
                }
              }

              const proxySize = {
                width: Number.parseInt(style.width || "0") * 2 || 0,
                height: Number.parseInt(style.height || "0") * 2 || 0,
              }
              return (
                <Media
                  style={style}
                  key={media.url}
                  src={media.url}
                  type={media.type}
                  previewImageUrl={media.preview_image_url}
                  blurhash={media.blurhash}
                  className="size-28 shrink-0 data-[state=loading]:!bg-theme-placeholder-image"
                  loading="lazy"
                  proxy={proxySize}
                  onClick={(e) => {
                    e.stopPropagation()
                    previewMedia(
                      mediaList.map((m) => ({
                        url: m.url,
                        type: m.type,
                        blurhash: m.blurhash,
                        fallbackUrl:
                          m.preview_image_url ?? getImageProxyUrl({ url: m.url, ...proxySize }),
                      })),
                      i,
                    )
                  }}
                />
              )
            })}
          </div>
        )}
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

SocialMediaItem.wrapperClassName = tw`w-[645px] max-w-full m-auto`

const ActionBar = ({ entryId }: { entryId: string }) => {
  const entry = useEntry(entryId)
  const view = useRouteParamsSelector((s) => s.view)
  const { items } = useEntryActions({
    entry,
    view,
    type: "toolbar",
  })
  return (
    <div className="flex origin-right scale-90 items-center gap-1">
      {items
        .filter((item) => !item.hide && item.key !== "read" && item.key !== "unread")
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

export function SocialMediaItemStateLess({ entry, feed }: EntryItemStatelessProps) {
  return (
    <div className="relative m-auto rounded-md text-zinc-700 transition-colors dark:text-neutral-400">
      <div className="relative">
        <div className="group relative flex px-8 py-6">
          <FeedIcon className="mr-2 size-9" feed={feed} fallback />
          <div className="ml-2 min-w-0 flex-1">
            <div className="-mt-0.5 line-clamp-5 flex-1 text-sm">
              <div className="flex space-x-1">
                <span>{feed.title}</span>
                <span className="text-zinc-500">·</span>
                <span>{!!entry.publishedAt && <RelativeTime date={entry.publishedAt} />}</span>
              </div>
              <div className="relative mt-0.5 text-sm">{entry.description}</div>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {entry.media?.map((media) => (
                <Media
                  key={media.url}
                  thumbnail
                  src={media.url}
                  type={media.type}
                  previewImageUrl={media.preview_image_url}
                  className="size-28 overflow-hidden rounded"
                  mediaContainerClassName={"w-auto h-auto rounded"}
                  loading="lazy"
                  proxy={{
                    width: 160,
                    height: 160,
                  }}
                  height={media.height}
                  width={media.width}
                  blurhash={media.blurhash}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SocialMediaItemSkeleton = (
  <div className="relative m-auto w-[645px] rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative">
      <div className="group relative flex px-8 py-6">
        <Skeleton className="mr-2 size-9" />
        <div className="ml-2 min-w-0 flex-1">
          <div className="-mt-0.5 line-clamp-5 flex-1 text-sm">
            <div className="flex w-[calc(100%-10rem)] space-x-1">
              <Skeleton className="h-4 w-16 " />
              <span className="text-zinc-500">·</span>
              <Skeleton className="h-4 w-12 " />
            </div>
            <div className="relative mt-0.5 text-sm">
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
