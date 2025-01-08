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
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { COMMAND_ID } from "~/modules/command/commands/id"
import { useCommand } from "~/modules/command/hooks/use-command"
import type { FollowCommandId } from "~/modules/command/types"
import { useToolbarOrderMap } from "~/modules/customize-toolbar/hooks"

export const MoreActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const actionConfigs = useEntryActions({ entryId, view })
  const orderMap = useToolbarOrderMap()
  const availableActions = useMemo(
    () =>
      actionConfigs
        .filter((item) => {
          const order = orderMap.get(item.id)
          // If the order is not set, it should be in the "more" menu
          if (!order) return true
          return order.type !== "main"
        })
        .filter((item) => item.id !== COMMAND_ID.settings.customizeToolbar)
        .sort((a, b) => {
          const orderA = orderMap.get(a.id)?.order || Infinity
          const orderB = orderMap.get(b.id)?.order || Infinity
          return orderA - orderB
        }),
    [actionConfigs, orderMap],
  )

  const extraAction = useMemo(
    () => actionConfigs.filter((item) => item.id === COMMAND_ID.settings.customizeToolbar),
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
        <DropdownMenuSeparator />
        {extraAction.map((config) => (
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
