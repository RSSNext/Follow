import { useEffect } from "react"

import type { FollowCommandOptions } from "../registry/command"
import { registerCommand } from "../registry/registry"

export type RegisterOptions = {
  deps?: unknown[]
  enabled?: boolean
  // forceMountSection?: boolean
  // sectionMeta?: Record<string, unknown>
  // orderSection?: OrderSectionInstruction
  // orderCommands?: OrderCommandsInstruction
}

export const useRegisterCommandEffect = (
  options: FollowCommandOptions | FollowCommandOptions[],
  // registerOptions?: RegisterOptions,
) => {
  // TODO memo command via useMemo
  // See https://github.com/supabase/supabase/blob/master/packages/ui-patterns/CommandMenu/api/hooks/commandsHooks.ts

  useEffect(() => {
    if (!Array.isArray(options)) {
      if (!options.when) return
      return registerCommand(options)
    }

    const unsubscribes = options.filter((i) => i.when).map((option) => registerCommand(option))
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [options])
}
