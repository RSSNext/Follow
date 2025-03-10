import type { HonoApiClient } from "@/src/morph/types"

export type ActionRule = HonoApiClient.ActionRule & { index: number }
export type ActionRules = ActionRule[]
