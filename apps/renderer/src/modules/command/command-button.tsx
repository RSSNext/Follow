import type { ActionButtonProps } from "@follow/components/ui/button/index.js"
import { ActionButton } from "@follow/components/ui/button/index.js"

import type { CommandId } from "./commands/id"
import { useCommand } from "./hooks/use-command"
import type { CommandContext, FollowCommand } from "./registry/command"

interface CommandButtonProps extends ActionButtonProps {
  command: FollowCommand
  context: CommandContext
  // args?: unknown[]
}

interface CommandIdButtonProps extends ActionButtonProps {
  commandId: CommandId
  context: CommandContext
  // args?: unknown[]
}

export const CommandActionButton = ({ command, context, ...props }: CommandButtonProps) => {
  return (
    <ActionButton
      disabled={!command.when}
      icon={command.icon}
      shortcut={command.keyBinding?.binding}
      tooltip={command.label.title}
      onClick={() => command.run({ context: context ?? {} })}
      {...props}
    />
  )
}

export const CommandIdButton = ({ commandId, ...props }: CommandIdButtonProps) => {
  const cmd = useCommand(commandId)
  if (!cmd) return
  return <CommandActionButton command={cmd} {...props} />
}
