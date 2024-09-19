import { useDragControls } from "framer-motion"
import { Resizable } from "re-resizable"
import type { PointerEventHandler, PropsWithChildren } from "react"
import { Suspense, useCallback, useEffect, useRef } from "react"

import { useUISettingSelector } from "~/atoms/settings/ui"
import { m } from "~/components/common/Motion"
import { Logo } from "~/components/icons/logo"
import { useResizeableModal } from "~/components/ui/modal"
import { preventDefault } from "~/lib/dom"
import { cn } from "~/lib/utils"

import { settings } from "../constants"
import { SettingSyncIndicator } from "../helper/SyncIndicator"
import { SettingsSidebarTitle } from "../title"
import { useSetSettingTab, useSettingTab } from "./context"
import { defaultCtx, SettingContext } from "./hooks"

export function SettingModalLayout(
  props: PropsWithChildren<{
    initialTab?: string
  }>,
) {
  const { children, initialTab } = props
  const setTab = useSetSettingTab()
  const tab = useSettingTab()
  const elementRef = useRef<HTMLDivElement>(null)
  const { handlePointDown, isResizeable, resizeableStyle } = useResizeableModal(elementRef, {
    enableResizeable: true,
  })

  useEffect(() => {
    if (!tab) {
      if (initialTab) {
        setTab(initialTab)
      } else {
        setTab(settings[0].path)
      }
    }
  }, [])

  const { draggable, overlay } = useUISettingSelector((state) => ({
    draggable: state.modalDraggable,
    overlay: state.modalOverlay,
  }))
  const dragController = useDragControls()
  const handleDrag: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (draggable) {
        dragController.start(e)
        handlePointDown()
      }
    },
    [dragController, draggable, handlePointDown],
  )

  return (
    <div className={cn("h-full", !isResizeable && "center")}>
      <m.div
        exit={{
          opacity: 0,
          scale: 0.96,
        }}
        className={cn(
          "relative flex overflow-hidden rounded-xl border border-border",
          !overlay && "shadow-perfect",
        )}
        style={resizeableStyle}
        onContextMenu={preventDefault}
        drag={draggable}
        dragControls={dragController}
        dragListener={false}
        dragMomentum={false}
        dragElastic={false}
        whileDrag={{
          cursor: "grabbing",
        }}
      >
        <SettingContext.Provider value={defaultCtx}>
          <Resizable
            onResizeStart={handlePointDown}
            enable={{
              bottomRight: true,
            }}
            style={{ ...resizeableStyle, position: "static" }}
            defaultSize={{
              width: 800,
              height: 700,
            }}
            maxHeight="80vh"
            minHeight={500}
            minWidth={600}
            maxWidth="95vw"
            className="flex flex-col"
          >
            {draggable && (
              <div className="absolute inset-x-0 top-0 z-[1] h-8" onPointerDown={handleDrag} />
            )}
            <div className="flex h-0 flex-1 bg-theme-modal-background-opaque" ref={elementRef}>
              <div className="flex min-h-0 w-44 flex-col border-r px-2 py-6">
                <div className="mb-4 flex h-8 items-center gap-2 px-2 font-bold">
                  <Logo className="mr-1 size-6" />
                  {APP_NAME}
                </div>
                <nav className="flex grow flex-col">
                  {settings.map((t) => (
                    <button
                      key={t.path}
                      className={`my-0.5 flex w-full items-center rounded-lg px-2.5 py-0.5 leading-loose text-theme-foreground/70 transition-colors ${
                        tab === t.path ? "bg-theme-item-active text-theme-foreground/90" : ""
                      }`}
                      type="button"
                      onClick={() => setTab(t.path)}
                    >
                      <SettingsSidebarTitle path={t.path} className="text-[0.94rem] font-medium" />
                    </button>
                  ))}
                </nav>

                <div className="relative -mb-5 h-8 shrink-0">
                  <SettingSyncIndicator />
                </div>
              </div>
              <div className="relative flex h-full flex-1 flex-col bg-theme-background pt-1">
                <Suspense>{children}</Suspense>
              </div>
            </div>
          </Resizable>
        </SettingContext.Provider>
      </m.div>
    </div>
  )
}
