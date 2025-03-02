import type { UniqueIdentifier } from "@dnd-kit/core"
import { useMemo } from "react"

import { useUISettingSelector } from "~/atoms/settings/ui"

export const useToolbarOrderMap = () => {
  const actionOrder = useUISettingSelector((s) => s.toolbarOrder)

  const actionOrderMap = useMemo(() => {
    const actionOrderMap = new Map<
      UniqueIdentifier,
      {
        type: "main" | "more"
        order: number
      }
    >()
    actionOrder.main.forEach((id, index) =>
      actionOrderMap.set(id, {
        type: "main",
        order: index,
      }),
    )
    actionOrder.more.forEach((id, index) =>
      actionOrderMap.set(id, {
        type: "more",
        order: index,
      }),
    )
    return actionOrderMap
  }, [actionOrder])
  return actionOrderMap
}
