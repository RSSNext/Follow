import { ActionButton } from "@follow/components/ui/button/index.js"
import type { FeedViewType } from "@follow/constants"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu/dropdown-menu"
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { COMMAND_ID } from "~/modules/command/commands/id"

export const MoreActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const actionConfigs = useEntryActions({ entryId, view })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton icon={<i className="i-mgc-more-1-cute-re" />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {actionConfigs
          .filter(
            (item) =>
              item.id.startsWith("integration") ||
              (
                [
                  COMMAND_ID.entry.read,
                  COMMAND_ID.entry.unread,
                  COMMAND_ID.entry.copyLink,
                  COMMAND_ID.entry.openInBrowser,
                ] as string[]
              ).includes(item.id),
          )
          .map((config) => (
            <DropdownMenuItem
              key={config.id}
              className="pl-3"
              icon={config.icon}
              onSelect={config.onClick}
            >
              {config.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
