import { apiClient } from "@/src/lib/api-fetch"

import { createImmerSetter, createZustandStore } from "../internal/helper"
import type { ActionRules } from "./types"

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
      actionActions.updateRules((res.data.rules ?? []).map((rule, index) => ({ ...rule, index })))

      actionActions.setDirty(false)
    }
    return res
  }

  async saveRules() {
    const { rules, isDirty } = useActionStore.getState()
    if (isDirty) {
      const res = await apiClient.actions.$put({ json: { rules } })
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

  updateRuleState(index: number, enabled: boolean) {
    immerSet((state) => {
      if (state.rules[index]) {
        state.rules[index].result.disabled = !enabled
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
