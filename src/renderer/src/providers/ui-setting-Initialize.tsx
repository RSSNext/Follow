import { useUISettingValue } from "@renderer/atoms/settings/ui"
import { tipcClient } from "@renderer/lib/client"
import { feedUnreadActions } from "@renderer/store/unread"
import { useEffect, useInsertionEffect } from "react"

const useUISettingSync = () => {
  const setting = useUISettingValue()

  useInsertionEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${setting.uiTextSize}px`
  }, [setting.uiTextSize])

  useEffect(() => {
    if (setting.showDockBadge) {
      return feedUnreadActions.subscribeUnreadCount((count) => tipcClient?.setMacOSBadge(count), true)
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
