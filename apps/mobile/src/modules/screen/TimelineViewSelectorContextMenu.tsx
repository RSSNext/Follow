import type { FeedViewType } from "@follow/constants"
import type { FC, PropsWithChildren } from "react"

import { ContextMenu } from "@/src/components/ui/context-menu"
import { unreadSyncService } from "@/src/store/unread/store"

export const TimelineViewSelectorContextMenu: FC<
  PropsWithChildren<{ type: string | undefined; viewId: FeedViewType | undefined }>
> = ({ children, type, viewId }) => {
  if (type !== "view" || viewId === undefined) return children

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item
          key="MarkAsRead"
          onSelect={() => {
            unreadSyncService.markViewAsRead(viewId)
          }}
        >
          <ContextMenu.ItemTitle>Mark as Read</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "checklist.checked",
            }}
          />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
