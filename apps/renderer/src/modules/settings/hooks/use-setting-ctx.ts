import { useMemo } from "react"

import { useUserRole } from "~/atoms/user"

import { settings } from "../constants"
import type { SettingPageContext } from "../utils"

export const useSettingPageContext = (): SettingPageContext => {
  const role = useUserRole()
  return useMemo(() => ({ role }), [role])
}

export const useAvailableSettings = () => {
  const ctx = useSettingPageContext()
  return useMemo(() => settings.filter((t) => !t.loader().hideIf?.(ctx)), [ctx])
}
