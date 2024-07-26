import { useUISettingValue } from "@renderer/atoms/settings/ui"
import { useSyncDark } from "@renderer/hooks/common"
import { tipcClient } from "@renderer/lib/client"
import { feedUnreadActions } from "@renderer/store/unread"
import { useEffect, useInsertionEffect } from "react"

const useUISettingSync = () => {
  const setting = useUISettingValue()
  useSyncDark()
  useInsertionEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${setting.uiTextSize}px`
  }, [setting.uiTextSize])

  useEffect(() => {
    if (setting.showDockBadge) {
      return feedUnreadActions.subscribeUnreadCount(
        (count) => tipcClient?.setDockBadge(count),
        true,
      )
    } else {
      tipcClient?.setDockBadge(0)
    }
    return
  }, [setting.showDockBadge])
}
export const SettingSync = () => {
  useUISettingSync()
  return null
}
