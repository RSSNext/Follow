import { useState } from "react"
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
}: {
  view?: number
  url: string
}) {
  const { execAction } = useEntryActions(url)

  return <>{url}</>
}
