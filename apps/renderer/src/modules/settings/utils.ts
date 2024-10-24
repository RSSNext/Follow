import type { UserRole } from "@follow/constants"

export interface SettingPageContext {
  role: Nullable<UserRole>
}

export enum DisableWhy {
  Noop = "noop",
  NotActivation = "not_activation",
}

export interface SettingPageConfig {
  iconName: string
  name: I18nKeysForSettings
  priority: number
  headerIcon?: string
  hideIf?: (ctx: SettingPageContext) => boolean
  disableIf?: (ctx: SettingPageContext) => [boolean, DisableWhy]
}
export const defineSettingPageData = (config: SettingPageConfig) => () => ({
  ...config,
})
