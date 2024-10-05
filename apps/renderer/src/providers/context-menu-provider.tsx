import type { ReactNode } from "react"
import { Fragment, memo, useCallback, useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"
import { KbdCombined } from "~/components/ui/kbd/Kbd"
import { HotKeyScopeMap } from "~/constants"
import { useSwitchHotKeyScope } from "~/hooks/common"
import { nextFrame } from "~/lib/dom"
import type { NativeMenuItem } from "~/lib/native-menu"
import { CONTEXT_MENU_SHOW_EVENT_KEY } from "~/lib/native-menu"

export const ContextMenuProvider: Component = ({ children }) => (
  <>
    {children}

    <Handler />
  </>
)

const Handler = () => {
  const ref = useRef<HTMLSpanElement>(null)

  const [node, setNode] = useState([] as ReactNode[] | ReactNode)

  const [open, setOpen] = useState(false)

  const switchHotkeyScope = useSwitchHotKeyScope()

  useEffect(() => {
    if (!open) return
    switchHotkeyScope("Menu")
    return () => {
      switchHotkeyScope("Home")
    }
  }, [open, switchHotkeyScope])

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

      if (!("items" in bizEvent.detail) || !("x" in bizEvent.detail) || !("y" in bizEvent.detail)) {
        return
      }
      if (!Array.isArray(bizEvent.detail?.items)) return

      setNode(bizEvent.detail.items.map((item, index) => <Item key={index} item={item} />))

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
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger className="hidden" ref={ref} />
      <ContextMenuContent>{node}</ContextMenuContent>
    </ContextMenu>
  )
}

const Item = memo(({ item }: { item: NativeMenuItem }) => {
  const onClick = useCallback(() => {
    if ("click" in item) {
      // Here we need to delay one frame,
      // so it's two raf's, in order to have `point-event: none` recorded by RadixOverlay after modal is invoked in a certain scenario,
      // and the page freezes after modal is turned off.
      nextFrame(() => {
        item.click?.()
      })
    }
  }, [item])
  const itemRef = useRef<HTMLDivElement>(null)
  useHotkeys((item as any).shortcut, () => itemRef.current?.click(), {
    enabled: (item as any).enabled !== false && (item as any).shortcut !== undefined,
    scopes: HotKeyScopeMap.Menu,
    preventDefault: true,
  })

  switch (item.type) {
    case "separator": {
      return <ContextMenuSeparator />
    }
    case "text": {
      const Wrapper = item.submenu
        ? ContextMenuSubTrigger
        : typeof item.checked === "boolean"
          ? ContextMenuCheckboxItem
          : ContextMenuItem

      const Sub = item.submenu ? ContextMenuSub : Fragment
      return (
        <Sub>
          <Wrapper
            ref={itemRef}
            disabled={item.enabled === false || (item.click === undefined && !item.submenu)}
            onClick={onClick}
            className="flex items-center gap-2"
            checked={item.checked}
          >
            {item.icon}
            {item.label}

            {!!item.shortcut && (
              <div className="ml-auto pl-4">
                <KbdCombined joint>{item.shortcut}</KbdCombined>
              </div>
            )}
          </Wrapper>
          {item.submenu && (
            <ContextMenuPortal>
              <ContextMenuSubContent>
                {item.submenu.map((subItem, index) => (
                  <Item key={index} item={subItem} />
                ))}
              </ContextMenuSubContent>
            </ContextMenuPortal>
          )}
        </Sub>
      )
    }
    default: {
      return null
    }
  }
})
