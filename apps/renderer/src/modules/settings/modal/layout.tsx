import { Logo } from "@follow/components/icons/logo.jsx"
import { LetsIconsResizeDownRightLight } from "@follow/components/icons/resize.jsx"
import { IN_ELECTRON } from "@follow/shared/constants"
import { preventDefault } from "@follow/utils/dom"
import { cn, getOS } from "@follow/utils/utils"
import type { BoundingBox } from "framer-motion"
import { useDragControls } from "framer-motion"
import { Resizable } from "re-resizable"
import type { PointerEventHandler, PropsWithChildren } from "react"
import { memo, Suspense, useCallback, useEffect, useRef } from "react"

import { useUISettingSelector } from "~/atoms/settings/ui"
import { m } from "~/components/common/Motion"
import { resizableOnly, useResizeableModal } from "~/components/ui/modal"
import { ElECTRON_CUSTOM_TITLEBAR_HEIGHT } from "~/constants"
import { useActivationModal } from "~/modules/activation"

import { SettingSyncIndicator } from "../helper/SyncIndicator"
import { useAvailableSettings, useSettingPageContext } from "../hooks/use-setting-ctx"
import { SettingsSidebarTitle } from "../title"
import type { SettingPageConfig } from "../utils"
import { DisableWhy } from "../utils"
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
  const edgeElementRef = useRef<HTMLDivElement>(null)
  const dragController = useDragControls()
  const {
    handleResizeStart,
    handleResizeStop,
    preferDragDir,
    relocateModal,
    isResizeable,
    resizeableStyle,
  } = useResizeableModal(elementRef, {
    enableResizeable: true,
    dragControls: dragController,
  })

  const availableSettings = useAvailableSettings()
  useEffect(() => {
    if (!tab) {
      if (initialTab) {
        setTab(initialTab)
      } else {
        setTab(availableSettings[0].path)
      }
    }
  }, [availableSettings])

  const { draggable, overlay } = useUISettingSelector((state) => ({
    draggable: state.modalDraggable,
    overlay: state.modalOverlay,
  }))
  const handleDrag: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (draggable) {
        dragController.start(e)
        relocateModal()
      }
    },
    [dragController, draggable, relocateModal],
  )
  const measureDragConstraints = useCallback((constraints: BoundingBox) => {
    if (getOS() === "Windows") {
      return {
        ...constraints,
        top: constraints.top + ElECTRON_CUSTOM_TITLEBAR_HEIGHT,
      }
    }
    return constraints
  }, [])

  return (
    <div className={cn("h-full", !isResizeable && "center")} ref={edgeElementRef}>
      <m.div
        exit={{
          opacity: 0,
          scale: 0.96,
        }}
        className={cn(
          "relative flex rounded-xl rounded-br-none border border-border bg-theme-background",
          !overlay && "shadow-perfect",
        )}
        style={resizeableStyle}
        onContextMenu={preventDefault}
        drag={draggable && (preferDragDir || draggable)}
        dragControls={dragController}
        dragListener={false}
        dragMomentum={false}
        dragElastic={false}
        dragConstraints={edgeElementRef}
        onMeasureDragConstraints={measureDragConstraints}
        whileDrag={{
          cursor: "grabbing",
        }}
      >
        <SettingContext.Provider value={defaultCtx}>
          <Resizable
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            enable={resizableOnly("bottomRight")}
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
            <div className="flex h-0 flex-1" ref={elementRef}>
              <div className="flex min-h-0 min-w-44 max-w-[20ch] flex-col rounded-l-xl border-r bg-theme-modal-background-opaque px-2 py-6">
                <div className="mb-4 flex h-8 items-center gap-2 px-2 font-default font-bold">
                  <Logo className="mr-1 size-6" />
                  {APP_NAME}
                </div>
                <nav className="flex grow flex-col">
                  <SidebarItems />
                </nav>

                <div className="relative -mb-5 h-8 shrink-0">
                  <SettingSyncIndicator />
                </div>
              </div>
              <div className="relative flex h-full min-w-0 flex-1 flex-col pt-1">
                <Suspense>{children}</Suspense>
              </div>
            </div>

            <LetsIconsResizeDownRightLight className="pointer-events-none absolute bottom-0 right-0 size-6 translate-x-px translate-y-px text-border" />
          </Resizable>
        </SettingContext.Provider>
      </m.div>
    </div>
  )
}

const SettingItemButtonImpl = (props: {
  tab: string
  setTab: (tab: string) => void
  item: SettingPageConfig
  path: string
}) => {
  const { tab, setTab, item, path } = props
  const { disableIf } = item

  const ctx = useSettingPageContext()

  const [disabled, why] = disableIf?.(ctx) || [false, DisableWhy.Noop]
  const presentActivationModal = useActivationModal()

  return (
    <button
      className={cn(
        "my-0.5 flex w-full items-center rounded-lg px-2.5 py-0.5 leading-loose text-theme-foreground/70",
        tab === path && "!bg-theme-item-active !text-theme-foreground/90",
        !IN_ELECTRON && "duration-200 hover:bg-theme-item-hover",
        disabled && "cursor-not-allowed opacity-50",
      )}
      type="button"
      onClick={useCallback(() => {
        setTab(path)
        if (disabled) {
          switch (why) {
            case DisableWhy.NotActivation: {
              presentActivationModal()
              break
            }
            case DisableWhy.Noop: {
              break
            }
          }
        }
      }, [disabled, why, presentActivationModal, setTab, path])}
    >
      <SettingsSidebarTitle path={path} className="text-[0.94rem] font-medium" />
    </button>
  )
}

const SettingItemButton = memo(SettingItemButtonImpl)

const SidebarItems = memo(
  () => {
    const setTab = useSetSettingTab()
    const tab = useSettingTab()
    const availableSettings = useAvailableSettings()
    return availableSettings.map((t) => (
      <SettingItemButton key={t.path} tab={tab} setTab={setTab} item={t} path={t.path} />
    ))
  },
  () => true,
)
