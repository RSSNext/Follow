import type { UISettings } from "@follow/shared/interface/settings"

import { createSettingAtom } from "./helper"

export const createDefaultSettings = (): UISettings => ({
  // Sidebar
  entryColWidth: 356,
  feedColWidth: 256,

  opaqueSidebar: false,
  sidebarShowUnreadCount: true,

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

  // View
  pictureViewMasonry: true,
  pictureViewFilterNoImage: false,
  wideMode: false,

  // TTS
  voice: "en-US-AndrewMultilingualNeural",
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
  "voice",
]
