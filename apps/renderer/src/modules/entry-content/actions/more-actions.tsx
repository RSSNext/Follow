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
import { useCommand } from "~/modules/command/hooks/use-command"
import type { FollowCommandId } from "~/modules/command/types"
import { useToolbarOrderMap } from "~/modules/customize-toolbar/atoms"

export const MoreActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const actionConfigs = useEntryActions({ entryId, view })
  const orderMap = useToolbarOrderMap()
  const availableActions = useMemo(
    () =>
      actionConfigs
        .filter((item) => {
          const order = orderMap.get(item.id)
          if (!order) return false
          return order.type !== "main"
        })
        .sort((a, b) => {
          const orderA = orderMap.get(a.id)?.order || 0
          const orderB = orderMap.get(b.id)?.order || 0
          return orderA - orderB
        }),
    [actionConfigs, orderMap],
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
