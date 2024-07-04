import { createSettingAtom } from "./helper"

const createDefaultSettings = () => ({
  // Sidebar
  entryColWidth: 340,
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

  // Content
  readerFontFamily: "SN Pro",
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
