import { useGeneralSettingKey } from "@renderer/atoms/settings/general"
import { ListItemHoverOverlay } from "@renderer/components/ui/list-item-hover-overlay"
import { useAsRead } from "@renderer/hooks/biz/useAsRead"
import { useEntryActions } from "@renderer/hooks/biz/useEntryActions"
import { useFeedActions } from "@renderer/hooks/biz/useFeedActions"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { FlatEntryModel } from "@renderer/store/entry"
import { entryActions } from "@renderer/store/entry"
import type { FC, PropsWithChildren } from "react"
import { useCallback } from "react"
import { useDebounceCallback } from "usehooks-ts"

export const EntryItemWrapper: FC<
  {
    entry: FlatEntryModel
    view?: number
    itemClassName?: string
    overlay?: boolean
  } & PropsWithChildren
> = ({ entry, view, overlay, children, itemClassName }) => {
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
              .filter((item) => !item.hide)
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
          "relative",
          asRead ?
            "text-zinc-700 dark:text-neutral-400" :
            "text-zinc-900 dark:text-neutral-300",
          itemClassName,
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseEnter.cancel}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {overlay ? (
          <ListItemHoverOverlay isActive={isActive}>
            {children}
          </ListItemHoverOverlay>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
