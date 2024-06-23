export interface SettingPageConfig {
  iconName: string
  name: string
  priority: number

}
export const defineSettingPage = (config: SettingPageConfig) => () => ({
  ...config,
})
