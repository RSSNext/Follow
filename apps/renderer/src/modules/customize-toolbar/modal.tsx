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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ActionButton } from "@follow/components/ui/button/action-button.js"
import { useCallback, useMemo, useState } from "react"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useI18n } from "~/hooks/common"

import { COMMAND_ID } from "../command/commands/id"
import { getCommand } from "../command/hooks/use-command"

const customizeActionIds = [
  ...Object.values(COMMAND_ID.entry),
  ...Object.values(COMMAND_ID.integration),
]

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    animateLayoutChanges: () => true, // Enable layout animations
    transition: {
      duration: 400,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  })

  const style = useMemo(() => {
    return {
      transform: CSS.Transform.toString(transform),
      transition,
      width: "80px", // Fixed width
      height: "80px", // Fixed height
      zIndex: isDragging ? 999 : undefined,
    }
  }, [transform, transition, isDragging])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={` ${isDragging ? "cursor-grabbing opacity-90" : "cursor-grab"} transition-colors duration-200`}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}

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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="mx-auto flex w-full max-w-[800px] flex-wrap items-center justify-center gap-3">
          {items.map((config) => (
            <SortableItem key={config.id} id={config.id}>
              <div className="flex flex-col items-center">
                <ActionButton icon={config.icon} />
                <div className="mt-1 text-center text-xs text-gray-500">{config.label.title}</div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
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
