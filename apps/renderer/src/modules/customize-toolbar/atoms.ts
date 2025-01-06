import type { UniqueIdentifier } from "@dnd-kit/core"
import { atom } from "jotai"
import { useMemo } from "react"

import { createAtomHooks } from "~/lib/jotai"

import { COMMAND_ID } from "../command/commands/id"

interface ActionOrder {
  main: UniqueIdentifier[]
  more: UniqueIdentifier[]
}

const DEFAULT_ACTION_ORDER: ActionOrder = {
  main: Object.values(COMMAND_ID.entry).filter(
    (id) =>
      !(
        [
          COMMAND_ID.entry.read,
          COMMAND_ID.entry.unread,
          COMMAND_ID.entry.copyLink,
          COMMAND_ID.entry.openInBrowser,
        ] as string[]
      ).includes(id),
  ),
  more: [
    ...Object.values(COMMAND_ID.integration),
    ...Object.values(COMMAND_ID.entry).filter((id) =>
      (
        [
          COMMAND_ID.entry.read,
          COMMAND_ID.entry.unread,
          COMMAND_ID.entry.copyLink,
          COMMAND_ID.entry.openInBrowser,
        ] as string[]
      ).includes(id),
    ),
    COMMAND_ID.settings.customizeToolbar,
  ],
}

export const [, , useActionOrder, , getActionOrder, setActionOrder] = createAtomHooks(
  atom<ActionOrder>(DEFAULT_ACTION_ORDER),
)

export const useToolbarOrderMap = () => {
  const actionOrder = useActionOrder()

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
