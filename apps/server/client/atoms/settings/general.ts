import type { GeneralSettings } from "@follow/shared/interface/settings"

import { jotaiStore } from "../../lib/store"
import { createSettingAtom } from "./helper"

const createDefaultSettings = (): GeneralSettings => ({
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

export const subscribeShouldUseIndexedDB = (callback: (value: boolean) => void) =>
  jotaiStore.sub(__generalSettingAtom, () => callback(getGeneralSettings().dataPersist))

export const generalServerSyncWhiteListKeys: (keyof GeneralSettings)[] = [
  "appLaunchOnStartup",
  "dataPersist",
  "sendAnonymousData",
  "language",
]
