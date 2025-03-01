import { useMemo } from "react"

import { useUserRole } from "~/atoms/user"

import { getMemoizedSettings } from "../settings-glob"
import type { SettingPageContext } from "../utils"

export const useSettingPageContext = (): SettingPageContext => {
  const role = useUserRole()
  return useMemo(() => ({ role }), [role])
}

export const useAvailableSettings = () => {
  const ctx = useSettingPageContext()
  return useMemo(() => getMemoizedSettings().filter((t) => !t.loader.hideIf?.(ctx)), [ctx])
}
