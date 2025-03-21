import type { GeneralSettings } from "@/src/interfaces/settings/general"

import { createSettingAtom } from "./internal/helper"

const createDefaultSettings = (): GeneralSettings => ({
  // App

  language: "en",
  actionLanguage: "zh-CN",

  // Data control

  sendAnonymousData: true,

  autoGroup: true,

  // view
  unreadOnly: true,
  // mark unread
  scrollMarkUnread: true,

  renderMarkUnread: false,
  // UX
  groupByDate: true,
  autoExpandLongSocialMedia: false,

  // Secure
  jumpOutLinkWarn: true,
  // TTS
  voice: "en-US-AndrewMultilingualNeural",

  // Content
  openLinksInApp: true,
})

export const {
  useSettingKey: useGeneralSettingKey,
  useSettingSelector: useGeneralSettingSelector,
  useSettingKeys: useGeneralSettingKeys,
  setSetting: setGeneralSetting,
  clearSettings: clearGeneralSettings,
  initializeDefaultSettings: initializeDefaultGeneralSettings,
  getSettings: getGeneralSettings,
  useSettingValue: useGeneralSettingValue,

  settingAtom: __generalSettingAtom,
} = createSettingAtom("general", createDefaultSettings)
