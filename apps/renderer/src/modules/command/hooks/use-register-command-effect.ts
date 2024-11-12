import { useEffect } from "react"

import { registerCommand } from "../registry/registry"
import type { CommandOptions } from "../types"

export type RegisterOptions = {
  deps?: unknown[]
  enabled?: boolean
  // forceMountSection?: boolean
  // sectionMeta?: Record<string, unknown>
  // orderSection?: OrderSectionInstruction
  // orderCommands?: OrderCommandsInstruction
}

export const useRegisterCommandEffect = (
  options: CommandOptions | CommandOptions[],
  // registerOptions?: RegisterOptions,
) => {
  // TODO memo command via useMemo
  // See https://github.com/supabase/supabase/blob/master/packages/ui-patterns/CommandMenu/api/hooks/commandsHooks.ts

  useEffect(() => {
    if (!Array.isArray(options)) {
      return registerCommand(options)
    }

    const unsubscribes = options.map((option) => registerCommand(option))
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [options])
}
