import type { HonoApiClient } from "@/src/morph/types"

export type ActionRule = HonoApiClient.ActionRule & { index: number }
export type ActionId = Exclude<keyof ActionRule["result"], "disabled">
export type ActionRules = ActionRule[]
