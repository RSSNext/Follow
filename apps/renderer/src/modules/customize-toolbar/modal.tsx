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
import { Button } from "@follow/components/ui/button/index.js"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"

import { resetActionOrder, setActionOrder, useActionOrder } from "./atoms"
import { DroppableContainer, SortableActionButton } from "./dnd"

const CustomizeToolbar = () => {
  const actionOrder = useActionOrder()

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
      const isActiveInMain = actionOrder.main.includes(activeId)
      const isOverInMain = overId === "container-main" || actionOrder.main.includes(overId)
      const isCrossContainer = isActiveInMain !== isOverInMain

      if (isCrossContainer) {
        // Moving between containers
        const sourceList = isActiveInMain ? "main" : "more"
        const targetList = isActiveInMain ? "more" : "main"
        const item = actionOrder[sourceList].find((item) => item === activeId)
        if (!item) return
        const newIndexOfOver = actionOrder[targetList].indexOf(overId)
        setActionOrder({
          ...actionOrder,
          [sourceList]: actionOrder[sourceList].filter((item) => item !== activeId),
          [targetList]: [
            ...actionOrder[targetList].slice(0, newIndexOfOver),
            item,
            ...actionOrder[targetList].slice(newIndexOfOver),
          ],
        })
        return
      }
      // Reordering within container
      const list = isActiveInMain ? "main" : "more"
      const items = actionOrder[list]
      const oldIndex = items.indexOf(activeId)
      const newIndex = items.indexOf(overId)

      setActionOrder({
        ...actionOrder,
        [list]: arrayMove(items, oldIndex, newIndex),
      })
    },
    [actionOrder],
  )

  return (
    <div className="mx-auto w-full max-w-[800px] space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <p className="text-sm text-gray-500">Customize and reorder your frequently used actions</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver}>
        <div className="space-y-4">
          {/* Main toolbar */}

          <DroppableContainer id="container-main">
            <SortableContext
              items={actionOrder.main.map((item) => item)}
              strategy={verticalListSortingStrategy}
            >
              {actionOrder.main.map((id) => (
                <SortableActionButton key={id} id={id} />
              ))}
            </SortableContext>
          </DroppableContainer>

          {/* More panel */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">More Actions</h2>
            <p className="text-sm text-gray-500">Will be shown in the dropdown menu</p>
          </div>

          <DroppableContainer id="container-more">
            <SortableContext
              items={actionOrder.more.map((item) => item)}
              strategy={verticalListSortingStrategy}
            >
              {actionOrder.more.map((id) => (
                <SortableActionButton key={id} id={id} />
              ))}
            </SortableContext>
          </DroppableContainer>
        </div>
      </DndContext>

      <div className="flex justify-end">
        <Button variant="outline" onClick={resetActionOrder}>
          Reset to Default Layout
        </Button>
      </div>
    </div>
  )
}

export const useShowCustomizeToolbarModal = () => {
  const [t] = useTranslation("settings")
  const { present } = useModalStack()

  return useCallback(() => {
    present({
      id: "customize-toolbar",
      title: t("customizeToolbar.title"),
      content: () => <CustomizeToolbar />,
      overlay: true,
      clickOutsideToDismiss: true,
    })
  }, [present, t])
}
