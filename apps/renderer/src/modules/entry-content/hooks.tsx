import { EventBus } from "@follow/utils/event-bus"
import { useEffect } from "react"

declare module "@follow/utils/event-bus" {
  export interface CustomEvent {
    FOCUS_ENTRY_CONTAINER: never
  }
}

export const useFocusEntryContainerSubscriptions = (ref: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    return EventBus.subscribe("FOCUS_ENTRY_CONTAINER", () => {
      ref.current?.focus()
    })
  }, [ref])
}
