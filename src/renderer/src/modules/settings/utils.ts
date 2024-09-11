
export interface SettingPageConfig {
  iconName: string
  name: I18nKeys
  priority: number
  headerIcon?: string
}
export const defineSettingPageData = (config: SettingPageConfig) => () => ({
  ...config,
})
