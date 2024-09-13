export interface SettingPageConfig {
  iconName: string
  name: I18nKeysForSettings
  priority: number
  headerIcon?: string
}
export const defineSettingPageData = (config: SettingPageConfig) => () => ({
  ...config,
})
