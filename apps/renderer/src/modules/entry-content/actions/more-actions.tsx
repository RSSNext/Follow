import { ActionButton } from "@follow/components/ui/button/index.js"
import type { FeedViewType } from "@follow/constants"
import { useMemo } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu/dropdown-menu"
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { COMMAND_ID } from "~/modules/command/commands/id"
import { useCommand } from "~/modules/command/hooks/use-command"
import type { FollowCommandId } from "~/modules/command/types"

export const MoreActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const actionConfigs = useEntryActions({ entryId, view })
  const availableActions = useMemo(
    () =>
      actionConfigs.filter(
        (item) =>
          item.id.startsWith("integration") ||
          ([COMMAND_ID.entry.copyLink, COMMAND_ID.entry.openInBrowser] as string[]).includes(
            item.id,
          ),
      ),
    [actionConfigs],
  )

  if (availableActions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton icon={<i className="i-mgc-more-1-cute-re" />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {availableActions.map((config) => (
          <CommandDropdownMenuItem key={config.id} commandId={config.id} onClick={config.onClick} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const CommandDropdownMenuItem = ({
  commandId,
  onClick,
}: {
  commandId: FollowCommandId
  onClick: () => void
}) => {
  const command = useCommand(commandId)
  if (!command) return null
  return (
    <DropdownMenuItem key={command.id} className="pl-3" icon={command.icon} onSelect={onClick}>
      {command.label.title}
    </DropdownMenuItem>
  )
}
