import type { GeneralSettings } from "@follow/shared/interface/settings"

import { createSettingAtom } from "./helper"

const createDefaultSettings = (): Partial<GeneralSettings> => ({
  // App
  appLaunchOnStartup: false,
  language: "en",
  // Data control
  dataPersist: true,
  sendAnonymousData: true,

  // view
  unreadOnly: false,
  // mark unread
  scrollMarkUnread: true,
  hoverMarkUnread: true,
  renderMarkUnread: false,
  // UX
  // autoHideFeedColumn: true,
  groupByDate: true,
  // Secure
  jumpOutLinkWarn: true,
  voice: "",
})

export const {
  useSettingKey: useGeneralSettingKey,
  useSettingSelector: useGeneralSettingSelector,
  setSetting: setGeneralSetting,
  clearSettings: clearGeneralSettings,
  initializeDefaultSettings: initializeDefaultGeneralSettings,
  getSettings: getGeneralSettings,
  useSettingValue: useGeneralSettingValue,

  settingAtom: __generalSettingAtom,
} = createSettingAtom("general", createDefaultSettings)

export const generalServerSyncWhiteListKeys: (keyof GeneralSettings)[] = [
  "appLaunchOnStartup",
  "dataPersist",
  "sendAnonymousData",
  "language",
]
