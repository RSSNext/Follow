import type { IntegrationSettings } from "@follow/shared/interface/settings"

import { createSettingAtom } from "./helper"

export const createDefaultSettings = (): IntegrationSettings => ({
  // eagle
  enableEagle: true,

  // readwise
  enableReadwise: false,
  readwiseToken: "",

  // instapaper
  enableInstapaper: false,
  instapaperUsername: "",
  instapaperPassword: "",

  // omnivore
  enableOmnivore: false,
  omnivoreEndpoint: "",
  omnivoreToken: "",

  // obsidian
  enableObsidian: false,
  obsidianVaultPath: "",
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
