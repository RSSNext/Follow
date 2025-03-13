import type { ConditionIndex } from "@/src/store/action/types"

export type SettingsStackParamList = {
  Profile: undefined
  Achievement: undefined
  General: undefined
  Notifications: undefined
  Appearance: undefined
  Data: undefined
  Account: undefined
  Actions: undefined
  Lists: undefined
  Feeds: undefined
  Privacy: undefined
  About: undefined
  ManageList: { id: string }
  EditRule: { index: number }
  EditCondition: ConditionIndex
  EditRewriteRules: { index: number }
  EditWebhooks: { index: number }
  EditProfile: undefined
  ResetPassword: undefined
}
