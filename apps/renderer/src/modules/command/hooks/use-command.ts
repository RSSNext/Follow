import { useAtomValue } from "jotai"

import type { FollowCommand } from "../registry/command"
import { CommandRegistry } from "../registry/registry"

export function useGetCommand() {
  const commands: Record<string, FollowCommand> = useAtomValue(CommandRegistry.atom)
  return (id: string) => (id in commands ? commands[id] : null)
}

export function useCommand(id: string) {
  const getCmd = useGetCommand()
  return getCmd(id)
}
