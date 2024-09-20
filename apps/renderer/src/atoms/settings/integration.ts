import type { IntegrationSettings } from "@follow/shared/interface/settings"

import { createSettingAtom } from "./helper"

export const createDefaultSettings = (): IntegrationSettings => ({
  enableEagle: true,
  enableReadwise: false,
  readwiseToken: "",
  enableInstapaper: false,
  instapaperUsername: "",
  instapaperPassword: "",
})

export const {
  useSettingKey: useIntegrationSettingKey,
  useSettingSelector: useIntegrationSettingSelector,
  setSetting: setIntegrationSetting,
  clearSettings: clearIntegrationSettings,
  initializeDefaultSettings: initializeDefaultIntegrationSettings,
  getSettings: getIntegrationSettings,
  useSettingValue: useIntegrationSettingValue,
} = createSettingAtom("integration", createDefaultSettings)
