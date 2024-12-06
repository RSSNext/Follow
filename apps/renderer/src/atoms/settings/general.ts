import { createSettingAtom } from "@follow/atoms/helper/setting.js"
import type { GeneralSettings } from "@follow/shared/interface/settings"

import { jotaiStore } from "~/lib/jotai"

const createDefaultSettings = (): GeneralSettings => ({
  // App
  appLaunchOnStartup: false,
  language: "en",
  translationLanguage: "zh-CN",

  // mobile app
  startupScreen: "timeline",
  // Data control
  dataPersist: true,
  sendAnonymousData: true,
  reduceRefetch: true,
  showQuickTimeline: true,

  autoGroup: true,

  // view
  unreadOnly: true,
  // mark unread
  scrollMarkUnread: true,
  hoverMarkUnread: true,
  renderMarkUnread: false,
  // UX

  groupByDate: true,
  // Secure
  jumpOutLinkWarn: true,
  // TTS
  voice: "en-US-AndrewMultilingualNeural",
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

export const subscribeShouldUseIndexedDB = (callback: (value: boolean) => void) =>
  jotaiStore.sub(__generalSettingAtom, () => callback(getGeneralSettings().dataPersist))

export const generalServerSyncWhiteListKeys: (keyof GeneralSettings)[] = [
  "appLaunchOnStartup",
  "dataPersist",
  "sendAnonymousData",
  "language",
  "voice",
]
