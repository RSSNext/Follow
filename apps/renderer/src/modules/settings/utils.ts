import type { UserRole } from "~/lib/enum"

export interface SettingPageContext {
  role: Nullable<UserRole>
}

export interface SettingPageConfig {
  iconName: string
  name: I18nKeysForSettings
  priority: number
  headerIcon?: string
  hideIf?: (ctx: SettingPageContext) => boolean
}
export const defineSettingPageData = (config: SettingPageConfig) => () => ({
  ...config,
})
