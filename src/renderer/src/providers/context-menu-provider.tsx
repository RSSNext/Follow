import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@renderer/components/ui/context-menu"
import { nextFrame } from "@renderer/lib/dom"
import type { NativeMenuItem } from "@renderer/lib/native-menu"
import { CONTEXT_MENU_SHOW_EVENT_KEY } from "@renderer/lib/native-menu"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

export const ContextMenuProvider: Component = ({ children }) => (
  <>
    {children}

    <Handler />
  </>
)

const Handler = () => {
  const ref = useRef<HTMLSpanElement>(null)

  const [node, setNode] = useState([] as ReactNode[] | ReactNode)
  useEffect(() => {
    const fakeElement = ref.current
    if (!fakeElement) return
    const handler = (e: unknown) => {
      const bizEvent = e as {
        detail?: {
          items: NativeMenuItem[]
          x: number
          y: number
        }
      }
      if (!bizEvent.detail) return

      if (
        !("items" in bizEvent.detail) ||
        !("x" in bizEvent.detail) ||
        !("y" in bizEvent.detail)
      ) {
        return
      }
      if (!Array.isArray(bizEvent.detail?.items)) return

      setNode(
        bizEvent.detail.items.map((item, index) => {
          switch (item.type) {
            case "separator": {
              return <ContextMenuSeparator key={index} />
            }
            case "text": {
              return (
                <ContextMenuItem
                  key={item.label}
                  disabled={item.enabled === false || item.click === undefined}
                  onClick={() => {
                    // Here we need to delay one frame,
                    // so it's two raf's, in order to have `point-event: none` recorded by RadixOverlay after modal is invoked in a certain scenario,
                    // and the page freezes after modal is turned off.
                    nextFrame(() => {
                      item.click?.()
                    })
                  }}
                >
                  {item.label}
                </ContextMenuItem>
              )
            }
            default: {
              return null
            }
          }
        }),
      )

      fakeElement.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          clientX: bizEvent.detail.x,
          clientY: bizEvent.detail.y,
        }),
      )
    }

    document.addEventListener(CONTEXT_MENU_SHOW_EVENT_KEY, handler)
    return () => {
      document.removeEventListener(CONTEXT_MENU_SHOW_EVENT_KEY, handler)
    }
  }, [])

  return (
    <ContextMenu>
      <ContextMenuTrigger className="hidden" ref={ref} />
      <ContextMenuContent>{node}</ContextMenuContent>
    </ContextMenu>
  )
}
