import type { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { ReactNode } from "react"
import { useMemo } from "react"

import { getCommand } from "../command/hooks/use-command"
import type { FollowCommandId } from "../command/types"

const SortableItem = ({ id, children }: { id: UniqueIdentifier; children: ReactNode }) => {
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
      width: "100px", // Fixed width
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

export const SortableActionButton = ({ id }: { id: UniqueIdentifier }) => {
  const cmd = getCommand(id as FollowCommandId)
  if (!cmd) return null
  return (
    <SortableItem id={id}>
      <div className="flex flex-col items-center rounded-lg p-2 hover:bg-theme-button-hover">
        <div className="flex size-8 items-center justify-center text-xl">{cmd.icon}</div>
        <div className="mt-1 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {cmd.label.title}
        </div>
      </div>
    </SortableItem>
  )
}
