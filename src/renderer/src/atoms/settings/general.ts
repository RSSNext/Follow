import { jotaiStore } from "@renderer/lib/jotai"
import type { GeneralSettings } from "@shared/interface/settings"

import { createSettingAtom } from "./helper"

const createDefaultSettings = (): GeneralSettings => ({
  // App
  appLaunchOnStartup: false,
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

export const subscribeShouldUseIndexedDB = (
  callback: (value: boolean) => void,
) =>
  jotaiStore.sub(__generalSettingAtom, () =>
    callback(getGeneralSettings().dataPersist))
