import type { ActionButtonProps } from "@follow/components/ui/button/action-button.js"
import { ActionButton } from "@follow/components/ui/button/action-button.js"
import { forwardRef } from "react"

import { useCommand } from "~/modules/command/hooks/use-command"
import type { FollowCommandId } from "~/modules/command/types"

export interface CommandActionButtonProps extends ActionButtonProps {
  commandId: FollowCommandId
  onClick: () => void
}
export const CommandActionButton = forwardRef<HTMLButtonElement, CommandActionButtonProps>(
  (props, ref) => {
    const { commandId, ...rest } = props
    const command = useCommand(commandId)
    if (!command) return null
    const { icon, label } = command

    return <ActionButton ref={ref} icon={icon} tooltip={label.title} {...rest} />
  },
)
