import { useCallback } from "react"
import { useHotkeysContext } from "react-hotkeys-hook"

import { HotKeyScopeMap } from "~/constants"

const allScopes = Object.keys(HotKeyScopeMap).reduce((acc, key) => {
  acc.push(...HotKeyScopeMap[key])
  return acc
}, [] as string[])
export const useSwitchHotKeyScope = () => {
  const { enableScope, disableScope } = useHotkeysContext()

  return useCallback(
    (scope: keyof typeof HotKeyScopeMap) => {
      const nextScope = HotKeyScopeMap[scope]
      if (!nextScope) return

      for (const key of allScopes) {
        disableScope(key)
      }

      enableScope(nextScope[0])
    },
    [disableScope, enableScope],
  )
}
