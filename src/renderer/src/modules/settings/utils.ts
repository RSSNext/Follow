export interface SettingPageConfig {
  iconName: string
  name: string
  priority: number
  headerIcon?: string
}
export const defineSettingPage = (config: SettingPageConfig) => () => ({
  ...config,
})
