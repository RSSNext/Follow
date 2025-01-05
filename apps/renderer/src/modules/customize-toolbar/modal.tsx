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
import { getCommand } from "../command/hooks/use-command"
import { SortableActionButton } from "./sortable"

const customizeActionIds = [
  ...Object.values(COMMAND_ID.entry),
  ...Object.values(COMMAND_ID.integration),
]

const CustomizeToolbar = () => {
  const [items, setItems] = useState(() =>
    customizeActionIds.map((id) => getCommand(id)).filter((i) => i !== null),
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  return (
    <div className="mx-auto w-full max-w-[800px]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <p className="text-sm text-gray-500">Customize and reorder your frequently used actions</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 pb-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex w-full flex-wrap items-center justify-center gap-1 p-2">
              {items.map((config) => (
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
