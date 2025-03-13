import { ActionButton } from "@follow/components/ui/button/index.js"
import type { FeedViewType } from "@follow/constants"
import { useMemo } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu/dropdown-menu"
import { useSortedEntryActions } from "~/hooks/biz/useEntryActions"
import { COMMAND_ID } from "~/modules/command/commands/id"
import { hasCommand, useCommand } from "~/modules/command/hooks/use-command"
import type { FollowCommandId } from "~/modules/command/types"

export const MoreActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const { moreAction } = useSortedEntryActions({ entryId, view })

  const actionConfigs = useMemo(
    () => moreAction.filter((action) => hasCommand(action.id)),
    [moreAction],
  )

  const availableActions = useMemo(
    () => actionConfigs.filter((item) => item.id !== COMMAND_ID.settings.customizeToolbar),
    [actionConfigs],
  )

  const extraAction = useMemo(
    () => actionConfigs.filter((item) => item.id === COMMAND_ID.settings.customizeToolbar),
    [actionConfigs],
  )

  if (availableActions.length === 0 && extraAction.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton icon={<i className="i-mgc-more-1-cute-re" />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {availableActions.map((config) => (
          <CommandDropdownMenuItem
            key={config.id}
            commandId={config.id}
            onClick={config.onClick}
            active={config.active}
          />
        ))}
        {availableActions.length > 0 && <DropdownMenuSeparator />}
        {extraAction.map((config) => (
          <CommandDropdownMenuItem
            key={config.id}
            commandId={config.id}
            onClick={config.onClick}
            active={config.active}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const CommandDropdownMenuItem = ({
  commandId,
  onClick,
  active,
}: {
  commandId: FollowCommandId
  onClick: () => void
  active?: boolean
}) => {
  const command = useCommand(commandId)
  if (!command) return null
  return (
    <DropdownMenuItem
      key={command.id}
      className="pl-3"
      icon={command.icon}
      onSelect={onClick}
      active={active}
    >
      {command.label.title}
    </DropdownMenuItem>
  )
}
