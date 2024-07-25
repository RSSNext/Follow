import { jotaiStore } from "@renderer/lib/jotai"

import { createSettingAtom } from "./helper"

const createDefaultSettings = () => ({
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
export type GeneralSettings = ReturnType<typeof createDefaultSettings>
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
