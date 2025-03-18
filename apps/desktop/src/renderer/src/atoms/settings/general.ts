import { createSettingAtom } from "@follow/atoms/helper/setting.js"
import type { SupportedLanguages } from "@follow/models"
import type { GeneralSettings } from "@follow/shared/interface/settings"

import { jotaiStore } from "~/lib/jotai"

const createDefaultSettings = (): GeneralSettings => ({
  // App
  appLaunchOnStartup: false,
  language: "en",
  actionLanguage: "zh-CN",

  // mobile app
  startupScreen: "timeline",
  // Data control
  dataPersist: true,
  sendAnonymousData: true,
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
  autoExpandLongSocialMedia: false,

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

export function useActionLanguage() {
  return useGeneralSettingSelector((s) => s.actionLanguage) as SupportedLanguages
}

export const subscribeShouldUseIndexedDB = (callback: (value: boolean) => void) =>
  jotaiStore.sub(__generalSettingAtom, () => callback(getGeneralSettings().dataPersist))

export const generalServerSyncWhiteListKeys: (keyof GeneralSettings)[] = [
  "appLaunchOnStartup",
  "dataPersist",
  "sendAnonymousData",
  "language",
  "voice",
]
