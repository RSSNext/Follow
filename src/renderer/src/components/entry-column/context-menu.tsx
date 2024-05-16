import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@renderer/components/ui/context-menu"
import { useEntryActions } from "@renderer/hooks/useEntryActions"

export const items = [
  [
    {
      name: "Copy Link",
      className: "i-mingcute-link-line",
      action: "copyLink",
    },
    {
      name: "Open in Browser",
      className: "i-mingcute-world-2-line",
      action: "openInBrowser",
    },
    {
      name: "Share",
      className: "i-mingcute-share-2-line",
      action: "share",
    },
  ],
]

export function EntryContextMenu({
  view,
  url,
  children,
}: {
  view: number
  url?: string
  children: React.ReactNode
}) {
  if (!url) return children

  const { execAction } = useEntryActions(url)

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
