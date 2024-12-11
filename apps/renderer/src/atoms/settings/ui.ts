import { createSettingAtom } from "@follow/atoms/helper/setting.js"
import type { UISettings } from "@follow/shared/interface/settings"
import { jotaiStore } from "@follow/utils/jotai"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { useEventCallback } from "usehooks-ts"

export const createDefaultSettings = (): UISettings => ({
  // Sidebar
  entryColWidth: 356,
  feedColWidth: 256,
  hideExtraBadge: false,

  opaqueSidebar: false,
  sidebarShowUnreadCount: true,
  thumbnailRatio: "square",

  // Global UI
  uiTextSize: 16,
  // System
  showDockBadge: true,
  // Misc
  modalOverlay: true,
  modalDraggable: true,
  modalOpaque: true,
  reduceMotion: false,
  usePointerCursor: false,

  // Font
  uiFontFamily: "SN Pro",
  readerFontFamily: "inherit",
  // Content
  readerRenderInlineStyle: false,
  codeHighlightThemeLight: "github-light",
  codeHighlightThemeDark: "github-dark",
  guessCodeLanguage: true,
  hideRecentReader: false,
  customCSS: "",

  // View
  pictureViewMasonry: true,
  pictureViewFilterNoImage: false,
  wideMode: false,
})

const zenModeAtom = atom(false)

export const {
  useSettingKey: useUISettingKey,
  useSettingSelector: useUISettingSelector,
  useSettingKeys: useUISettingKeys,
  setSetting: setUISetting,
  clearSettings: clearUISettings,
  initializeDefaultSettings: initializeDefaultUISettings,
  getSettings: getUISettings,
  useSettingValue: useUISettingValue,
  settingAtom: __uiSettingAtom,
} = createSettingAtom("ui", createDefaultSettings)

export const uiServerSyncWhiteListKeys: (keyof UISettings)[] = [
  "uiFontFamily",
  "readerFontFamily",
  "opaqueSidebar",
  // "customCSS",
]

export const useIsZenMode = () => useAtomValue(zenModeAtom)
export const getIsZenMode = () => jotaiStore.get(zenModeAtom)

export const useSetZenMode = () => {
  const setZenMode = useSetAtom(zenModeAtom)
  return useEventCallback((checked: boolean) => {
    setZenMode(checked)
  })
}

export const useToggleZenMode = () => {
  const setZenMode = useSetZenMode()
  const isZenMode = useIsZenMode()
  return useEventCallback(() => {
    const newIsZenMode = !isZenMode
    document.documentElement.dataset.zenMode = newIsZenMode.toString()
    setZenMode(newIsZenMode)
  })
}

export const useRealInWideMode = () => {
  const wideMode = useUISettingKey("wideMode")
  const isZenMode = useIsZenMode()
  return wideMode || isZenMode
}
