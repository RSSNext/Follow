import type { DragControls } from "framer-motion"
import type { ResizeCallback, ResizeStartCallback } from "re-resizable"
import { useCallback, useContext, useId, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useContextSelector } from "use-context-selector"
import { useEventCallback } from "usehooks-ts"

import { getUISettings } from "~/atoms/settings/ui"
import { jotaiStore } from "~/lib/jotai"

import { modalStackAtom } from "./atom"
import { CurrentModalContext, CurrentModalStateContext } from "./context"
import type { ModalProps, ModalStackOptions } from "./types"

export const modalIdToPropsMap = {} as Record<string, ModalProps>
export const useModalStack = (options?: ModalStackOptions) => {
  const id = useId()
  const currentCount = useRef(0)
  const { wrapper } = options || {}

  return {
    present: useCallback(
      (props: ModalProps & { id?: string }) => {
        const fallbackModelId = `${id}-${++currentCount.current}`
        const modalId = props.id ?? fallbackModelId

        const currentStack = jotaiStore.get(modalStackAtom)

        const existingModal = currentStack.find((item) => item.id === modalId)
        if (existingModal) {
          // Move to top
          jotaiStore.set(modalStackAtom, (p) => {
            const index = p.indexOf(existingModal)
            return [...p.slice(0, index), ...p.slice(index + 1), existingModal]
          })
        } else {
          // NOTE: The props of the Command Modal are immutable, so we'll just take the store value and inject it.
          // There is no need to inject `overlay` props, this is rendered responsively based on ui changes.
          const uiSettings = getUISettings()
          const modalConfig: Partial<ModalProps> = {
            draggable: uiSettings.modalDraggable,
            modal: true,
          }
          jotaiStore.set(modalStackAtom, (p) => {
            const modalProps: ModalProps = {
              ...modalConfig,
              ...props,

              wrapper,
            }
            modalIdToPropsMap[modalId] = modalProps
            return p.concat({
              id: modalId,
              ...modalProps,
            })
          })
        }

        return () => {
          jotaiStore.set(modalStackAtom, (p) => p.filter((item) => item.id !== modalId))
        }
      },
      [id, wrapper],
    ),

    ...actions,
  }
}
const actions = {
  getTopModalStack() {
    return jotaiStore.get(modalStackAtom)[0]
  },
  getModalStackById(id: string) {
    return jotaiStore.get(modalStackAtom).find((item) => item.id === id)
  },
  dismiss(id: string) {
    jotaiStore.set(modalStackAtom, (p) => p.filter((item) => item.id !== id))
  },
  dismissTop() {
    jotaiStore.set(modalStackAtom, (p) => p.slice(0, -1))
  },
  dismissAll() {
    jotaiStore.set(modalStackAtom, [])
  },
}

export const useCurrentModal = () => useContext(CurrentModalContext)

export const useResizeableModal = (
  modalElementRef: React.RefObject<HTMLDivElement>,
  {
    enableResizeable,
    dragControls,
  }: {
    enableResizeable: boolean
    dragControls?: DragControls
  },
) => {
  const [resizeableStyle, setResizeableStyle] = useState({} as React.CSSProperties)
  const [isResizeable, setIsResizeable] = useState(false)
  const [preferDragDir, setPreferDragDir] = useState<"x" | "y" | null>(null)

  const relocateModal = useEventCallback(() => {
    if (!enableResizeable) return
    if (isResizeable) return
    const $modalElement = modalElementRef.current
    if (!$modalElement) return

    const rect = $modalElement.getBoundingClientRect()
    const { x, y } = rect

    flushSync(() => {
      setIsResizeable(true)
      setResizeableStyle({
        position: "fixed",
        top: `${y}px`,
        left: `${x}px`,
      })
    })
  })
  const handleResizeStart = useEventCallback(((e, dir) => {
    if (!enableResizeable) return
    relocateModal()

    const hasTop = /top/i.test(dir)
    const hasLeft = /left/i.test(dir)
    if (hasTop || hasLeft) {
      dragControls?.start(e as any)
      if (hasTop && hasLeft) {
        setPreferDragDir(null)
      } else if (hasTop) {
        setPreferDragDir("y")
      } else if (hasLeft) {
        setPreferDragDir("x")
      }
    }
  }) satisfies ResizeStartCallback)
  const handleResizeStop = useEventCallback((() => {
    setPreferDragDir(null)
  }) satisfies ResizeCallback)

  return {
    resizeableStyle,
    isResizeable,
    relocateModal,
    handleResizeStart,
    handleResizeStop,
    preferDragDir,
  }
}

export const useIsTopModal = () => useContextSelector(CurrentModalStateContext, (v) => v.isTop)
