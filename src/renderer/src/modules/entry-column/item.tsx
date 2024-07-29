import { useGeneralSettingKey } from "@renderer/atoms/settings/general"
import { ListItemHoverOverlay } from "@renderer/components/ui/list-item-hover-overlay"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { views } from "@renderer/constants"
import { useAsRead } from "@renderer/hooks/biz/useAsRead"
import { useEntryActions } from "@renderer/hooks/biz/useEntryActions"
import { useFeedActions } from "@renderer/hooks/biz/useFeedActions"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { useAuthQuery } from "@renderer/hooks/common"
import { FeedViewType } from "@renderer/lib/enum"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import { Queries } from "@renderer/queries"
import type { FlatEntryModel } from "@renderer/store/entry"
import { entryActions } from "@renderer/store/entry"
import { useEntry } from "@renderer/store/entry/hooks"
import type { FC, ReactNode } from "react"
import { memo, useCallback } from "react"
import { useDebounceCallback } from "usehooks-ts"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import { ArticleItem, ArticleItemSkeleton } from "./article-item"
import { AudioItem, AudioItemSkeleton } from "./audio-item"
import {
  NotificationItem,
  NotificationItemSkeleton,
} from "./notification-item"
import { PictureItem, PictureItemSkeleton } from "./picture-item"
import { SocialMediaItem, SocialMediaItemSkeleton } from "./social-media-item"
import type { EntryListItemFC } from "./types"
import { VideoItem, VideoItemSkeleton } from "./video-item"

interface EntryItemProps {
  entryId: string
  view?: number
}
function EntryItemImpl({
  entry,
  view,
}: {
  entry: FlatEntryModel
  view?: number
}) {
  const { items } = useEntryActions({
    view,
    entry,
  })

  const { items: feedItems } = useFeedActions({
    feedId: entry.feedId,
    view,
    type: "entryList",
  })

  const translation = useAuthQuery(
    Queries.ai.translation({
      entry,
      view,
      language: entry.settings?.translation,
    }),
    {
      enabled: !!entry.settings?.translation,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      meta: {
        persist: true,
      },
    },
  )

  const isActive = useRouteParamsSelector(
    ({ entryId }) => entryId === entry.entries.id,
  )

  const asRead = useAsRead(entry)
  const hoverMarkUnread = useGeneralSettingKey("hoverMarkUnread")

  const handleMouseEnter = useDebounceCallback(
    () => {
      if (!hoverMarkUnread) return
      if (!document.hasFocus()) return
      if (asRead) return

      entryActions.markRead(entry.feedId, entry.entries.id, true)
    },
    233,
    {
      leading: false,
    },
  )
  let Item: EntryListItemFC

  switch (view) {
    case FeedViewType.Articles: {
      Item = ArticleItem
      break
    }
    case FeedViewType.SocialMedia: {
      Item = SocialMediaItem
      break
    }
    case FeedViewType.Pictures: {
      Item = PictureItem
      break
    }
    case FeedViewType.Videos: {
      Item = VideoItem
      break
    }
    case FeedViewType.Audios: {
      Item = AudioItem
      break
    }
    case FeedViewType.Notifications: {
      Item = NotificationItem
      break
    }
    default: {
      Item = ArticleItem
    }
  }

  const navigate = useNavigateEntry()
  const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation()

      navigate({
        entryId: entry.entries.id,
      })
    },
    [entry.entries.id, navigate],
  )
  const handleDoubleClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      () => entry.entries.url && window.open(entry.entries.url, "_blank"),
      [entry.entries.url],
    )
  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        e.preventDefault()
        showNativeMenu(
          [
            ...items
              .filter((item) => !item.disabled)
              .map((item) => ({
                type: "text" as const,
                label: item.name,
                click: item.onClick,
                shortcut: item.shortcut,
              })),
            {
              type: "separator" as const,
            },
            ...feedItems.filter((item) => !item.disabled),

            {
              type: "separator" as const,
            },
            {
              type: "text" as const,
              label: "Copy Entry ID",
              click: () => {
                navigator.clipboard.writeText(entry.entries.id)
              },
            },
          ],
          e,
        )
      },
      [items, feedItems, entry.entries.id],
    )

  return (
    <div data-entry-id={entry.entries.id}>
      <div
        className={cn(
          "relative rounded-md bg-theme-background transition-colors",
          asRead ?
            "text-zinc-700 dark:text-neutral-400" :
            "text-zinc-900 dark:text-neutral-300",
          Item.wrapperClassName,
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <ListItemHoverOverlay
          className={cn(views[view || 0].gridMode ? "inset-0" : "inset-y-1")}
          isActive={isActive}
        >
          <Item entryId={entry.entries.id} translation={translation.data} />
        </ListItemHoverOverlay>
      </div>
    </div>
  )
}

export const EntryItem: FC<EntryItemProps> = memo(({ entryId, view }) => {
  const entry = useEntry(entryId)
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return <EntryItemImpl entry={entry} view={view} />
})

const SkeletonItemMap = {
  [FeedViewType.Articles]: ArticleItemSkeleton,
  [FeedViewType.SocialMedia]: SocialMediaItemSkeleton,
  [FeedViewType.Pictures]: PictureItemSkeleton,
  [FeedViewType.Videos]: VideoItemSkeleton,
  [FeedViewType.Audios]: AudioItemSkeleton,
  [FeedViewType.Notifications]: NotificationItemSkeleton,
}

const LoadingCircleFallback = (
  <div className="center mt-2">
    <LoadingCircle size="medium" />
  </div>
)
export const EntryItemSkeleton: FC<{
  view: FeedViewType
  single?: boolean
}> = memo(({ view, single }) => {
  const SkeletonItem = SkeletonItemMap[view]
  if (single) {
    return SkeletonItem
  }
  return SkeletonItem ?
      (
        <div className="flex flex-col">{createSkeletonItems(SkeletonItem)}</div>
      ) :
      (
        LoadingCircleFallback
      )
})

const createSkeletonItems = (element: ReactNode) => {
  const children = [] as ReactNode[]
  for (let i = 0; i < 10; i++) {
    children.push(element)
  }
  return children
}
