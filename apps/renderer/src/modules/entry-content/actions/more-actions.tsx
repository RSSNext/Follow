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
import type { EntryCommand } from "~/modules/command/commands/types"
import { useCommands } from "~/modules/command/hooks/use-command"

export const MoreActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const { moreAction } = useSortedEntryActions({ entryId, view })
  const commands = useCommands()

  const actionConfigs = useMemo(
    () =>
      moreAction
        .map((item) => ({
          config: item,
          command: commands[item.id] as EntryCommand,
        }))
        .filter(({ command }) => command),
    [moreAction],
  )

  const availableActions = useMemo(
    () => actionConfigs.filter(({ config }) => config.id !== COMMAND_ID.settings.customizeToolbar),
    [actionConfigs],
  )

  const extraAction = useMemo(
    () => actionConfigs.filter(({ config }) => config.id === COMMAND_ID.settings.customizeToolbar),
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
          <CommandDropdownMenuItem key={config.id} command={command} onClick={config.onClick} />
        ))}
        {availableActions.length > 0 && extraAction.length > 0 && <DropdownMenuSeparator />}
        {extraAction.map(({ config, command }) => (
          <CommandDropdownMenuItem key={config.id} command={command} onClick={config.onClick} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const CommandDropdownMenuItem = ({
  command,
  onClick,
  active,
}: {
  command: EntryCommand
  onClick: () => void
  active?: boolean
}) => {
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
