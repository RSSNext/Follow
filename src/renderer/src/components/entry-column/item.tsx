import { useAsRead, useBizQuery, useEntryActions, useRead } from "@renderer/hooks"
import { views } from "@renderer/lib/constants"
import { FeedViewType } from "@renderer/lib/enum"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { EntryModel } from "@renderer/models"
import { Queries } from "@renderer/queries"
import { feedActions, useFeedStore } from "@renderer/store"
import { useEntry } from "@renderer/store/entry/hooks"
import type { FC } from "react"
import { memo, useCallback } from "react"

import { ReactVirtuosoItemPlaceholder } from "../ui/placeholder"
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
function EntryItemImpl({ entry, view }: { entry: EntryModel, view?: number }) {
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
    },
  )

  const activeEntry = useFeedStore((state) => state.activeEntryId)

  const asRead = useAsRead(entry)

  const markReadMutation = useRead(entry)

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
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    useCallback(() => {}, [])
  const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation()
      feedActions.setActiveEntry(entry.entries.id)
      if (!asRead) {
        markReadMutation.mutate()
      }
    },
    [asRead, entry.entries.id, markReadMutation],
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
          "rounded-md bg-background transition-colors",
          !views[view || 0].wideMode &&
          activeEntry === entry.entries.id &&
          "bg-theme-item-active",
          asRead ? "text-zinc-500/90" : "text-zinc-900 dark:text-white/90",
        )}
        onKeyDown={handleKeyDown}
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
