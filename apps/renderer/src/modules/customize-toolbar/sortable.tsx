import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { ReactNode } from "react"
import * as React from "react"
import { useMemo } from "react"

const SortableItem = ({ id, children }: { id: string; children: ReactNode }) => {
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

export const SortableActionButton = ({
  id,
  label,
  icon,
}: {
  id: string
  label: string
  icon: ReactNode
}) => (
  <SortableItem id={id}>
    <div className="flex flex-col items-center rounded-lg p-2 hover:bg-theme-button-hover">
      <div className="flex size-8 items-center justify-center text-xl">{icon}</div>
      <div className="mt-1 text-center text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
    </div>
  </SortableItem>
)
