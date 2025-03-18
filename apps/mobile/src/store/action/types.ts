import type { HonoApiClient } from "@/src/morph/types"

export type ActionFilterItem = Partial<HonoApiClient.ActionRule["condition"][number][number]>
export type ActionFilterGroup = ActionFilterItem[]
export type ActionFilter = ActionFilterGroup[]

export type ActionRule = Omit<HonoApiClient.ActionRule, "condition"> & {
  condition: ActionFilter
  index: number
}
export type ActionId = Exclude<keyof ActionRule["result"], "disabled">
export type ActionRules = ActionRule[]

export type ConditionIndex = {
  ruleIndex: number
  groupIndex: number
  conditionIndex: number
}
