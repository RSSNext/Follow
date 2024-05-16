import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@renderer/components/ui/context-menu"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { EntriesResponse } from "@renderer/lib/types"

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
      name: "Save Images to Eagle",
      icon: "/eagle.svg",
      action: "save-to-eagle",
    },
    {
      name: "Share",
      className: "i-mingcute-share-2-line",
      action: "share",
    },
  ],
]

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

  const { execAction } = useEntryActions({
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
