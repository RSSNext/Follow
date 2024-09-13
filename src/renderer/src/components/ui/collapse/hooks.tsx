import { createContextState } from "foxact/context-state"
import { useContext } from "react"

export const [
  CollapseStateProvider,
  useCurrentCollapseId,
  useSetCurrentCollapseId,
  ____CollapseStateContext,
] = createContextState<string | null>(null)

export const [
  CollapseGroupItemStateProvider,
  useCollapseGroupItemState,
  useSetCollapseGroupItemState,
  ____CollapseGroupItemStateContext,
] = createContextState<Record<string, boolean>>({})
export const useCollapseId = () => useContext(____CollapseStateContext)
export const useCollapseGroupItem = () => useContext(____CollapseGroupItemStateContext)
