import { useUIStore } from "@renderer/store"
import { useInsertionEffect } from "react"

export const UISettingInitialize = () => {
  const state = useUIStore()

  useInsertionEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${state.uiTextSize}px`
  }, [state.uiTextSize])
  return null
}
