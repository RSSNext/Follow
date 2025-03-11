import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { actionSyncService, useActionStore } from "./store"

export const usePrefetchActionRules = () => {
  return useQuery({
    queryKey: ["action", "rules"],
    queryFn: () => actionSyncService.fetchRules(),
  })
}

export const useActionRules = () => {
  return useActionStore((state) => state.rules)
}

export const useActionRule = (index?: number) => {
  return useActionStore(
    useCallback((state) => (index !== undefined ? state.rules[index] : undefined), [index]),
  )
}

export function useActionRuleCondition({
  ruleIndex,
  groupIndex,
  conditionIndex,
}: {
  ruleIndex: number
  groupIndex: number
  conditionIndex: number
}) {
  return useActionStore(
    useCallback(
      (state) => state.rules[ruleIndex]?.condition[groupIndex]?.[conditionIndex],
      [ruleIndex, groupIndex, conditionIndex],
    ),
  )
}

export const useIsActionDataDirty = () => {
  return useActionStore((state) => state.isDirty)
}
