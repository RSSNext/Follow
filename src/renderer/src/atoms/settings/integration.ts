import type { IntegrationSettings } from "@shared/interface/settings"

import { createSettingAtom } from "./helper"

export const createDefaultSettings = (): IntegrationSettings => ({
  enableEagle: true,
  enableReadwise: true,
  readwiseToken: "",
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
