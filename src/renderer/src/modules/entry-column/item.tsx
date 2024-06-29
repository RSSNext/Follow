import { useAsRead, useBizQuery, useEntryActions } from "@renderer/hooks"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { views } from "@renderer/lib/constants"
import { FeedViewType } from "@renderer/lib/enum"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { CombinedEntryModel } from "@renderer/models"
import { Queries } from "@renderer/queries"
import { useEntry } from "@renderer/store/entry/hooks"
import type { FC } from "react"
import { memo, useCallback } from "react"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import { ArticleItem } from "./article-item"
import { AudioItem } from "./audio-item"
import { NotificationItem } from "./notification-item"
import { PictureItem } from "./picture-item"
import { SocialMediaItem } from "./social-media-item"
import type { UniversalItemProps } from "./types"
import { VideoItem } from "./video-item"

interface EntryItemProps {
  entryId: string
  view?: number
}
function EntryItemImpl({ entry, view }: { entry: CombinedEntryModel, view?: number }) {
  const { items } = useEntryActions({
    view,
    entry,
  })

  const translation = useBizQuery(
    Queries.ai.translation({
      entry,
      view,
      language: entry.settings?.translation,
    }),
    {
      enabled: !!entry.settings?.translation,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )

  const isActive = useRouteParamsSelector(({ entryId }) => entryId === entry.entries.id)

  const asRead = useAsRead(entry)

  let Item: FC<UniversalItemProps>

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
          items
            .filter((item) => !item.disabled)
            .map((item) => ({
              type: "text",
              label: item.name,
              click: item.onClick,
            })),
          e,
        )
      },
      [items],
    )

  return (
    <div
      className={cn(!views[view || 0].wideMode && "pb-3")}
      data-entry-id={entry.entries.id}
    >
      <div
        className={cn(
          "rounded-md bg-theme-background transition-colors",
          isActive &&
          "bg-theme-item-active",
          asRead ? "text-zinc-700 dark:text-neutral-400" : "text-zinc-900 dark:text-neutral-300",
        )}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <Item entryId={entry.entries.id} translation={translation.data} />
      </div>
    </div>
  )
}

export const EntryItem: FC<EntryItemProps> = memo(({ entryId, view }) => {
  const entry = useEntry(entryId)
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return <EntryItemImpl entry={entry} view={view} />
})
