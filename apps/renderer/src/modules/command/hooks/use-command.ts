import { useAtomValue } from "jotai"

import { CommandRegistry } from "../registry/registry"
import type { FollowCommandId, FollowCommandMap } from "../types"

export function useGetCommand() {
  const commands = useAtomValue(CommandRegistry.atom) as FollowCommandMap
  return <T extends FollowCommandId>(id: T): FollowCommandMap[T] | null =>
    id in commands ? commands[id] : null
}

export function useCommand<T extends FollowCommandId>(id: T): FollowCommandMap[T] | null {
  const getCmd = useGetCommand()
  return getCmd(id)
}
