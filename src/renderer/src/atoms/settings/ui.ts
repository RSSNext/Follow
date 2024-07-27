import type { UISettings } from "@shared/interface/settings"

import { createSettingAtom } from "./helper"

const createDefaultSettings = (): UISettings => ({
  // Sidebar
  entryColWidth: 340,
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

  // Font
  uiFontFamily: "SN Pro",
  readerFontFamily: "inherit",
  // Content
  readerRenderInlineStyle: false,
  codeHighlightTheme: "github-dark",
})

export const {
  useSettingKey: useUISettingKey,
  useSettingSelector: useUISettingSelector,
  setSetting: setUISetting,
  clearSettings: clearUISettings,
  initializeDefaultSettings: initializeDefaultUISettings,
  getSettings: getUISettings,
  useSettingValue: useUISettingValue,
} = createSettingAtom("ui", createDefaultSettings)
