import type { DragOverEvent } from "@dnd-kit/core"
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
import type { BasicCommand } from "../command/commands/types"
import { getCommand } from "../command/hooks/use-command"
import { SortableActionButton } from "./sortable"

const customizeActionIds = [
  ...Object.values(COMMAND_ID.entry),
  ...Object.values(COMMAND_ID.integration),
]

const CustomizeToolbar = () => {
  const items = customizeActionIds.map((id) => getCommand(id)).filter((i) => i !== null)
  const [state, setState] = useState<{ main: BasicCommand[]; more: BasicCommand[] }>({
    main: items.filter((item) => !item.id.startsWith("integration")),
    more: items.filter((item) => item.id.startsWith("integration")),
  })

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
      const isActiveInMain = state.main.some((item) => item.id === activeId)
      const isOverInMain = state.main.some((item) => item.id === overId)

      if (isActiveInMain !== isOverInMain) {
        // Moving between containers
        setState((prev) => {
          const sourceList = isActiveInMain ? "main" : "more"
          const targetList = isActiveInMain ? "more" : "main"
          const item = prev[sourceList].find((item) => item.id === activeId)
          if (!item) return prev
          const newIndexOfOver = prev[targetList].findIndex((item) => item.id === overId)
          return {
            ...prev,
            [sourceList]: prev[sourceList].filter((item) => item.id !== activeId),
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
        const oldIndex = items.findIndex((item) => item.id === activeId)
        const newIndex = items.findIndex((item) => item.id === overId)

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
            items={state.main.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 pb-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex w-full flex-wrap items-center justify-center gap-1 p-2">
                {state.main.map((config) => (
                  <SortableActionButton
                    key={config.id}
                    id={config.id}
                    label={config.label.title}
                    icon={config.icon}
                  />
                ))}
              </div>
            </div>
          </SortableContext>

          {/* More panel */}
          <SortableContext
            items={state.more.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex w-full items-center px-4 py-2 dark:border-neutral-800">
              <h2 className="text-lg font-semibold">More Actions</h2>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 pb-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex w-full flex-wrap items-center justify-center gap-1 p-2">
                {state.more.map((config) => (
                  <SortableActionButton
                    key={config.id}
                    id={config.id}
                    label={config.label.title}
                    icon={config.icon}
                  />
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
      title: t("settings.customizeToolbar"),
      content: () => <CustomizeToolbar />,
      overlay: true,
      clickOutsideToDismiss: true,
    })
  }, [present, t])
}
