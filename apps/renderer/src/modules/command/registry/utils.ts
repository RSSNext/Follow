import type { BaseMenuItemText } from "~/atoms/context-menu"

import type { Command } from "./command"

export const commandToMenu = (command: Command): BaseMenuItemText => {
  return {
    type: "text",
    label: command.label.title,
    icon: command.icon,
    shortcut: command.keyBinding?.binding,
    click: command.run,
  }
}
