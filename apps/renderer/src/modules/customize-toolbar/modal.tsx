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
import { useTranslation } from "react-i18next"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"

import { COMMAND_ID } from "../command/commands/id"
import { DroppableContainer, SortableActionButton } from "./dnd"

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
      const isOverInMain = overId === "container-main" || state.main.includes(overId)
      const isCrossContainer = isActiveInMain !== isOverInMain

      if (isCrossContainer) {
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

          <DroppableContainer id="container-main">
            <SortableContext
              items={state.main.map((item) => item)}
              strategy={verticalListSortingStrategy}
            >
              {state.main.map((id) => (
                <SortableActionButton key={id} id={id} />
              ))}
            </SortableContext>
          </DroppableContainer>

          {/* More panel */}
          <div className="flex w-full items-center px-4 py-2 dark:border-neutral-800">
            <h2 className="text-lg font-semibold">More Actions</h2>
          </div>

          <DroppableContainer id="container-more">
            <SortableContext
              items={state.more.map((item) => item)}
              strategy={verticalListSortingStrategy}
            >
              {state.more.map((id) => (
                <SortableActionButton key={id} id={id} />
              ))}
            </SortableContext>
          </DroppableContainer>
        </div>
      </DndContext>
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
