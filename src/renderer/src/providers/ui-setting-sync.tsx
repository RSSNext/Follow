import { useUISettingValue } from "@renderer/atoms/settings/ui"
import { useDark } from "@renderer/hooks/common"
import { tipcClient } from "@renderer/lib/client"
import { feedUnreadActions } from "@renderer/store/unread"
import { useEffect, useInsertionEffect, useLayoutEffect } from "react"

const useUISettingSync = () => {
  const setting = useUISettingValue()

  const { isDark } = useDark()

  useLayoutEffect(() => {
    tipcClient?.setAppearance(
      isDark ? "dark" : "light",
    )
  }, [isDark])
  useInsertionEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${setting.uiTextSize}px`
  }, [setting.uiTextSize])

  useEffect(() => {
    if (setting.showDockBadge) {
      return feedUnreadActions.subscribeUnreadCount(
        (count) => tipcClient?.setMacOSBadge(count),
        true,
      )
    } else {
      tipcClient?.setMacOSBadge(0)
    }
    return
  }, [setting.showDockBadge])
}
export const SettingSync = () => {
  useUISettingSync()
  return null
}
