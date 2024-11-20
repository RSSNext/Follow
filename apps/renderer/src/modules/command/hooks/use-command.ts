import { useAtomValue } from "jotai"
import { useCallback } from "react"

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

const noop = () => {}
export function useRunCommandFn() {
  const getCmd = useGetCommand()
  return useCallback(
    <T extends FollowCommandId>(id: T, args: Parameters<FollowCommandMap[T]["run"]>) => {
      const cmd = getCmd(id)
      if (!cmd) return noop
      // @ts-expect-error - The type should be discriminated
      return () => cmd.run(...args)
    },
    [getCmd],
  )
}
