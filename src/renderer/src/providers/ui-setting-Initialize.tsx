import { initializeDefaultUISettings, useUISettingValue } from "@renderer/atoms"
import { tipcClient } from "@renderer/lib/client"
import { feedUnreadActions } from "@renderer/store"
import { useEffect, useInsertionEffect } from "react"

initializeDefaultUISettings()
export const UISettingInitialize = () => {
  const state = useUISettingValue()

  useInsertionEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${state.uiTextSize}px`
  }, [state.uiTextSize])

  useEffect(() => {
    if (state.showDockBadge) {
      return feedUnreadActions.subscribeUnreadCount((count) => tipcClient?.setMacOSBadge(count), true)
    } else {
      tipcClient?.setMacOSBadge(0)
    }
    return
  }, [state.showDockBadge])
  return null
}
