import { merge } from "es-toolkit/compat"

import { apiClient } from "@/src/lib/api-fetch"

import { createImmerSetter, createZustandStore } from "../internal/helper"
import type { ActionFilterItem, ActionId, ActionRule, ActionRules, ConditionIndex } from "./types"

type ActionStore = {
  rules: ActionRules
  isDirty?: boolean
}

export const useActionStore = createZustandStore<ActionStore>("action")(() => ({
  rules: [],
  isDirty: false,
}))

const immerSet = createImmerSetter(useActionStore)

class ActionSyncService {
  async fetchRules() {
    const res = await apiClient.actions.$get()
    if (res.data) {
      actionActions.updateRules(
        (res.data.rules ?? []).map((rule, index) => ({ ...rule, index })) as any,
      )

      actionActions.setDirty(false)
    }
    return res
  }

  async saveRules() {
    const { rules, isDirty } = useActionStore.getState()
    if (isDirty) {
      const res = await apiClient.actions.$put({ json: { rules: rules as any } })
      actionActions.setDirty(false)
      return res
    }
    return null
  }
}

class ActionActions {
  updateRules(rules: ActionRules) {
    immerSet((state) => {
      state.rules = rules
      state.isDirty = true
    })
  }

  patchRule(index: number, rule: Partial<ActionRule>) {
    immerSet((state) => {
      if (state.rules[index]) {
        state.rules[index] = merge(state.rules[index], rule)
        state.isDirty = true
      }
    })
  }

  pathCondition(index: ConditionIndex, condition: Partial<ActionFilterItem>) {
    immerSet((state) => {
      const rule = state.rules[index.ruleIndex]
      if (!rule) return
      const group = rule.condition[index.groupIndex]
      if (!group) return
      group[index.conditionIndex] = merge(group[index.conditionIndex], condition)
      state.isDirty = true
    })
  }

  addConditionItem(index: Omit<ConditionIndex, "conditionIndex">) {
    immerSet((state) => {
      const rule = state.rules[index.ruleIndex]
      if (!rule) return
      const group = rule.condition[index.groupIndex]
      if (!group) return
      group.push({})
      state.isDirty = true
    })
  }

  addConditionGroup(index: Omit<ConditionIndex, "conditionIndex" | "groupIndex">) {
    immerSet((state) => {
      const rule = state.rules[index.ruleIndex]
      if (!rule) return
      rule.condition.push([{}])
      state.isDirty = true
    })
  }

  toggleRuleFilter(index: number) {
    immerSet((state) => {
      if (state.rules[index]) {
        const hasCustomFilters = state.rules[index].condition.length > 0
        state.rules[index].condition = hasCustomFilters ? [] : [[]]
      }
    })
  }

  deleteRuleAction(index: number, actionId: ActionId) {
    immerSet((state) => {
      if (state.rules[index]) {
        delete state.rules[index].result[actionId]
        state.isDirty = true
      }
    })
  }

  deleteRule(index: number) {
    immerSet((state) => {
      state.rules.splice(index, 1)
      state.isDirty = true
    })
  }

  setDirty(isDirty: boolean) {
    immerSet((state) => {
      state.isDirty = isDirty
    })
  }
}

export const actionSyncService = new ActionSyncService()
export const actionActions = new ActionActions()
