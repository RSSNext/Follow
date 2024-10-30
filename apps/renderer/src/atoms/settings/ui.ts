import { createSettingAtom } from "@follow/atoms/helper/setting.js"
import type { UISettings } from "@follow/shared/interface/settings"
import { atom, useAtomValue } from "jotai"

import { internal_feedColumnShowAtom } from "../sidebar"

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

export const {
  useSettingKey: useUISettingKey,
  useSettingSelector: useUISettingSelector,
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
  "customCSS",
]

const isZenModeAtom = atom((get) => {
  const ui = get(__uiSettingAtom)
  return ui.wideMode && !get(internal_feedColumnShowAtom)
})

export const useIsZenMode = () => useAtomValue(isZenModeAtom)
