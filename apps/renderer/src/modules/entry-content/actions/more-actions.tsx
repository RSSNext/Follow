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
import type { CustomizeToolbarCommand, EntryCommand } from "~/modules/command/commands/types"
import { getCommand } from "~/modules/command/hooks/use-command"

export const MoreActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const { moreAction: actionConfigs } = useSortedEntryActions({ entryId, view })
  const availableActions = useMemo(
    () =>
      actionConfigs
        .filter((item) => item.id !== COMMAND_ID.settings.customizeToolbar)
        .map((item) => ({
          config: item,
          command: getCommand(item.id) as EntryCommand,
        }))
        .filter(({ command }) => command),
    [actionConfigs],
  )

  const extraAction = useMemo(
    () =>
      actionConfigs
        .filter((item) => item.id === COMMAND_ID.settings.customizeToolbar)
        .map((item) => ({
          config: item,
          command: getCommand(item.id) as CustomizeToolbarCommand,
        }))
        .filter(({ command }) => command),
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
        {availableActions.map(({ config, command }) => (
          <DropdownMenuItem
            key={command.id}
            className="pl-3"
            icon={command.icon}
            onSelect={config.onClick}
            active={config.active}
          >
            {command.label.title}
          </DropdownMenuItem>
        ))}
        {availableActions.length > 0 && <DropdownMenuSeparator />}
        {extraAction.map(({ config, command }) => (
          <DropdownMenuItem
            key={command.id}
            className="pl-3"
            icon={command.icon}
            onSelect={config.onClick}
            active={config.active}
          >
            {command.label.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
