import type { DragOverEvent, UniqueIdentifier } from "@dnd-kit/core"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useCallback, useState } from "react"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useI18n } from "~/hooks/common"

import { COMMAND_ID } from "../command/commands/id"
import { SortableActionButton } from "./sortable"

const DEFAULT_ACTION_ORDER: {
  main: UniqueIdentifier[]
  more: UniqueIdentifier[]
} = {
  main: Object.values(COMMAND_ID.entry),
  more: [...Object.values(COMMAND_ID.integration), COMMAND_ID.settings.customizeToolbar],
}

const CustomizeToolbar = () => {
  const [state, setState] = useState(DEFAULT_ACTION_ORDER)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      if (!over) return
      const activeId = active.id
      const overId = over.id
      const isActiveInMain = state.main.includes(activeId)
      const isOverInMain = state.main.includes(overId)

      if (isActiveInMain !== isOverInMain) {
        // Moving between containers
        setState((prev) => {
          const sourceList = isActiveInMain ? "main" : "more"
          const targetList = isActiveInMain ? "more" : "main"
          const item = prev[sourceList].find((item) => item === activeId)
          if (!item) return prev
          const newIndexOfOver = prev[targetList].indexOf(overId)
          return {
            ...prev,
            [sourceList]: prev[sourceList].filter((item) => item !== activeId),
            [targetList]: [
              ...prev[targetList].slice(0, newIndexOfOver),
              item,
              ...prev[targetList].slice(newIndexOfOver),
            ],
          }
        })
        return
      }
      // Reordering within container
      setState((prev) => {
        const list = isActiveInMain ? "main" : "more"
        const items = prev[list]
        const oldIndex = items.indexOf(activeId)
        const newIndex = items.indexOf(overId)

        return {
          ...prev,
          [list]: arrayMove(items, oldIndex, newIndex),
        }
      })
    },
    [state.main],
  )

  return (
    <div className="mx-auto w-full max-w-[800px]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <p className="text-sm text-gray-500">Customize and reorder your frequently used actions</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver}>
        <div className="space-y-4">
          {/* Main toolbar */}
          <SortableContext
            items={state.main.map((item) => item)}
            strategy={verticalListSortingStrategy}
          >
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 pb-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex w-full flex-wrap items-center justify-center gap-1 p-2">
                {state.main.map((id) => (
                  <SortableActionButton key={id} id={id} />
                ))}
              </div>
            </div>
          </SortableContext>

          {/* More panel */}
          <SortableContext
            items={state.more.map((item) => item)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex w-full items-center px-4 py-2 dark:border-neutral-800">
              <h2 className="text-lg font-semibold">More Actions</h2>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 pb-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex w-full flex-wrap items-center justify-center gap-1 p-2">
                {state.more.map((id) => (
                  <SortableActionButton key={id} id={id} />
                ))}
              </div>
            </div>
          </SortableContext>
        </div>
      </DndContext>
    </div>
  )
}

export const useShowCustomizeToolbarModal = () => {
  const t = useI18n()
  const { present } = useModalStack()

  return useCallback(() => {
    present({
      id: "customize-toolbar",
      title: t("settings.customizeToolbar.title"),
      content: () => <CustomizeToolbar />,
      overlay: true,
      clickOutsideToDismiss: true,
    })
  }, [present, t])
}
