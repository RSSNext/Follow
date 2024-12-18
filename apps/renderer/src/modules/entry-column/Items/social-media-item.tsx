import { PassviseFragment } from "@follow/components/common/Fragment.js"
import { useMobile } from "@follow/components/hooks/useMobile.js"
import { AutoResizeHeight } from "@follow/components/ui/auto-resize-height/index.js"
import { Skeleton } from "@follow/components/ui/skeleton/index.jsx"
import type { MediaModel } from "@follow/shared/hono"
import { LRUCache } from "@follow/utils/lru-cache"
import { cn } from "@follow/utils/utils"
import { atom } from "jotai"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { CommandActionButton } from "~/components/ui/button/command-button"
import { RelativeTime } from "~/components/ui/datetime"
import { Media } from "~/components/ui/media"
import { usePreviewMedia } from "~/components/ui/media/hooks"
import { useAsRead } from "~/hooks/biz/useAsRead"
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { getImageProxyUrl } from "~/lib/img-proxy"
import { jotaiStore } from "~/lib/jotai"
import { parseSocialMedia } from "~/lib/parsers"
import { COMMAND_ID } from "~/modules/command/commands/id"
import { FeedIcon } from "~/modules/feed/feed-icon"
import { FeedTitle } from "~/modules/feed/feed-title"
import { useEntry } from "~/store/entry/hooks"
import { useFeedById } from "~/store/feed"

import { filterSmallMedia } from "../../../lib/utils"
import { StarIcon } from "../star-icon"
import { EntryTranslation } from "../translation"
import type { EntryItemStatelessProps, EntryListItemFC } from "../types"

const socialMediaContentWidthAtom = atom(0)
export const SocialMediaItem: EntryListItemFC = ({ entryId, entryPreview, translation }) => {
  const entry = useEntry(entryId) || entryPreview

  const asRead = useAsRead(entry)
  const feed = useFeedById(entry?.feedId)

  const ref = useRef<HTMLDivElement>(null)
  const [showAction, setShowAction] = useState(false)

  const isMobile = useMobile()
  const handleMouseEnter = useMemo(() => {
    return () => setShowAction(true)
  }, [])
  const handleMouseLeave = useMemo(() => {
    return () => setShowAction(false)
  }, [])

  useLayoutEffect(() => {
    if (ref.current) {
      jotaiStore.set(socialMediaContentWidthAtom, ref.current.offsetWidth)
    }
  }, [])
  const autoExpandLongSocialMedia = useGeneralSettingKey("autoExpandLongSocialMedia")

  if (!entry || !feed) return null

  const content = entry.entries.content || entry.entries.description

  const parsed = parseSocialMedia(entry.entries)
  const media = filterSmallMedia(entry.entries.media)
  const EntryContentWrapper = autoExpandLongSocialMedia
    ? PassviseFragment
    : CollapsedSocialMediaItem

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex px-5 py-4 lg:px-8",
        "group",
        !asRead &&
          "before:absolute before:left-1 before:top-8 before:block before:size-2 before:rounded-full before:bg-accent md:before:-left-2 lg:before:left-2",
      )}
    >
      <FeedIcon fallback feed={feed} entry={entry.entries} size={32} className="mt-1" />
      <div ref={ref} className="ml-2 min-w-0 flex-1">
        <div className="-mt-0.5 flex-1 text-sm">
          <div className="select-none space-x-1 leading-6">
            <span className="inline-flex items-center gap-1 text-base font-semibold">
              <FeedTitle
                feed={feed}
                title={entry.entries.author || feed.title}
                titleClassName="max-w-[calc(100vw-8rem)]"
              />
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
            <EntryContentWrapper entryId={entryId}>
              <EntryTranslation
                className="cursor-auto select-text text-sm leading-relaxed prose-blockquote:mt-0 [&_br:last-child]:hidden"
                source={content}
                target={translation?.content}
                isHTML
              />
            </EntryContentWrapper>
            {!!entry.collections && <StarIcon className="absolute right-0 top-0" />}
          </div>
        </div>
        {!!media?.length && <SocialMediaGallery media={media} />}
      </div>

      {showAction && !isMobile && (
        <div className={"absolute right-1 top-1.5"}>
          <ActionBar entryId={entryId} />
        </div>
      )}
    </div>
  )
}

SocialMediaItem.wrapperClassName = tw`w-[645px] max-w-full m-auto`

const ActionBar = ({ entryId }: { entryId: string }) => {
  const entryActions = useEntryActions({ entryId })
  return (
    <div className="flex origin-right scale-90 items-center gap-1">
      {entryActions
        .filter(
          (item) =>
            item.id !== COMMAND_ID.entry.read &&
            item.id !== COMMAND_ID.entry.unread &&
            item.id !== COMMAND_ID.entry.openInBrowser,
        )
        .map((item) => (
          <CommandActionButton commandId={item.id} onClick={item.onClick} key={item.id} />
        ))}
    </div>
  )
}

export function SocialMediaItemStateLess({ entry, feed }: EntryItemStatelessProps) {
  return (
    <div className="relative m-auto select-none rounded-md text-zinc-700 transition-colors dark:text-neutral-400">
      <div className="relative">
        <div className="group relative flex px-8 py-6">
          <FeedIcon className="mr-2 size-9" feed={feed} fallback />
          <div className="ml-2 min-w-0 flex-1">
            <div className="-mt-0.5 line-clamp-5 flex-1 text-sm">
              <div className="flex space-x-1">
                <FeedTitle feed={feed} />
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

const SocialMediaGallery = ({ media }: { media: MediaModel[] }) => {
  const previewMedia = usePreviewMedia()

  const isAllMediaSameRatio = useMemo(() => {
    let ratio = 0
    for (const m of media) {
      if (m.height && m.width) {
        const currentRatio = m.height / m.width
        if (ratio === 0) {
          ratio = currentRatio
        } else if (ratio !== currentRatio) {
          return false
        }
      } else {
        return false
      }
    }
    return true
  }, [media])

  // all media has same ratio, use horizontal layout
  if (isAllMediaSameRatio) {
    return (
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
    )
  }

  // all media has different ratio, use grid layout
  return (
    <div className="mt-4">
      <div
        className={cn(
          "grid gap-2",
          media.length === 2 && "grid-cols-2",
          media.length === 3 && "grid-cols-2",
          media.length === 4 && "grid-cols-2",
          media.length >= 5 && "grid-cols-3",
        )}
      >
        {media.map((m, i) => {
          const proxySize = {
            width: 400,
            height: 400,
          }

          const style = media.length === 3 && i === 2 ? { gridRow: "span 2" } : {}

          return (
            <Media
              style={style}
              key={m.url}
              src={m.url}
              type={m.type}
              previewImageUrl={m.preview_image_url}
              blurhash={m.blurhash}
              className="aspect-square w-full rounded object-cover"
              loading="lazy"
              proxy={proxySize}
              onClick={(e) => {
                e.stopPropagation()
                previewMedia(
                  media.map((m) => ({
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
    </div>
  )
}

const collapsedHeight = 300
const collapsedItemCache = new LRUCache<string, boolean>(100)
const CollapsedSocialMediaItem: Component<{
  entryId: string
}> = ({ children, entryId }) => {
  const { t } = useTranslation()
  const [isOverflow, setIsOverflow] = useState(false)
  const [isShowMore, setIsShowMore] = useState(() => collapsedItemCache.get(entryId) ?? false)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      setIsOverflow(ref.current.scrollHeight > collapsedHeight)
    }
  }, [children])

  return (
    <AutoResizeHeight spring className="relative">
      <div
        className={cn(
          "relative",
          !isShowMore && "max-h-[300px] overflow-hidden",
          isShowMore && "h-auto",
          !isShowMore && isOverflow && "mask-b-2xl",
        )}
        ref={ref}
      >
        {children}
      </div>
      {isOverflow && !isShowMore && (
        <div className="absolute inset-x-0 -bottom-2 flex select-none justify-center py-2 duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsShowMore(true)
              collapsedItemCache.put(entryId, true)
            }}
            aria-hidden
            className="flex items-center justify-center text-xs duration-200 hover:text-foreground"
          >
            <i className="i-mingcute-arrow-to-down-line" />
            <span className="ml-2">{t("words.show_more")}</span>
          </button>
        </div>
      )}
    </AutoResizeHeight>
  )
}
