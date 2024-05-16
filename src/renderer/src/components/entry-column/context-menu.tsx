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
  view: number
  children: React.ReactNode
}) {
  if (!entry?.url) return children

  const { execAction, items } = useEntryActions({
    url: entry.url,
    images: entry.images,
  })

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">{children}</ContextMenuTrigger>
      <ContextMenuContent onClick={(e) => e.stopPropagation()}>
        {items[view].map((item) => (
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
