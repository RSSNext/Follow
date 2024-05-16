import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@renderer/components/ui/context-menu"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { EntriesResponse } from "@renderer/lib/types"

export function EntryContextMenu({
  entry,
  view,
  children,
}: {
  entry: EntriesResponse[number]
  view?: number
  children: React.ReactNode
}) {
  if (!entry?.url || view === undefined) return children

  const { execAction, items } = useEntryActions({
    url: entry.url,
    images: entry.images,
    view,
  })

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">{children}</ContextMenuTrigger>
      <ContextMenuContent onClick={(e) => e.stopPropagation()}>
        {items
          .filter((item) => !item.disabled)
          .map((item) => (
            <ContextMenuItem
              key={item.name}
              onClick={() => execAction(item.action)}
            >
              {item.name}
            </ContextMenuItem>
          ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
