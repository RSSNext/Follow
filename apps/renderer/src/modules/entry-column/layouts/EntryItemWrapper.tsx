import type { FC, PropsWithChildren } from "react"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDebounceCallback } from "usehooks-ts"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { views } from "~/constants/tabs"
import { useAsRead } from "~/hooks/biz/useAsRead"
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { useFeedActions } from "~/hooks/biz/useFeedActions"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useAnyPointDown } from "~/hooks/common"
import type { FeedViewType } from "~/lib/enum"
import { showNativeMenu } from "~/lib/native-menu"
import { cn } from "~/lib/utils"
import type { FlatEntryModel } from "~/store/entry"
import { entryActions } from "~/store/entry"

export const EntryItemWrapper: FC<
  {
    entry: FlatEntryModel
    view?: number
    itemClassName?: string
    style?: React.CSSProperties
  } & PropsWithChildren
> = ({ entry, view, children, itemClassName, style }) => {
  const { items } = useEntryActions({
    view,
    entry,
    type: "entryList",
  })

  const { items: feedItems } = useFeedActions({
    feedId: entry.feedId,
    view,
    type: "entryList",
  })

  const { t } = useTranslation("common")

  const isActive = useRouteParamsSelector(({ entryId }) => entryId === entry.entries.id)

  const asRead = useAsRead(entry)
  const hoverMarkUnread = useGeneralSettingKey("hoverMarkUnread")

  const handleMouseEnter = useDebounceCallback(
    () => {
      if (!hoverMarkUnread) return
      if (!document.hasFocus()) return
      if (asRead) return

      entryActions.markRead({ feedId: entry.feedId, entryId: entry.entries.id, read: true })
    },
    233,
    {
      leading: false,
    },
  )

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
  const handleDoubleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    () => entry.entries.url && window.open(entry.entries.url, "_blank"),
    [entry.entries.url],
  )
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  useAnyPointDown(() => setIsContextMenuOpen(false))
  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault()
      setIsContextMenuOpen(true)
      showNativeMenu(
        [
          ...items
            .filter((item) => !item.hide)
            .map((item) => ({
              type: "text" as const,
              label: item.name,
              click: () => item.onClick(e),
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
            label: `${t("words.copy")}${t("space")}${t("words.entry")} ${t("words.id")}`,
            click: () => {
              navigator.clipboard.writeText(entry.entries.id)
            },
          },
        ],
        e,
      )
    },
    [items, feedItems, t, entry.entries.id],
  )

  return (
    <div data-entry-id={entry.entries.id} style={style}>
      <div
        className={cn(
          "relative",
          asRead ? "text-zinc-700 dark:text-neutral-400" : "text-zinc-900 dark:text-neutral-300",
          views[view as FeedViewType]?.wideMode ? "rounded-md" : "-mx-2 px-2",
          "duration-200 hover:bg-theme-item-hover",
          (isActive || isContextMenuOpen) && "!bg-theme-item-active",
          itemClassName,
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseEnter.cancel}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {children}
      </div>
    </div>
  )
}
