import { useCallback, useContext, useId, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useEventCallback } from "usehooks-ts"

import { getUISettings } from "~/atoms/settings/ui"
import { jotaiStore } from "~/lib/jotai"

import { modalStackAtom } from "./atom"
import { CurrentModalContext } from "./context"
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
  }: {
    enableResizeable: boolean
  },
) => {
  const [resizeableStyle, setResizeableStyle] = useState({} as React.CSSProperties)
  const [isResizeable, setIsResizeable] = useState(false)

  const handlePointDown = useEventCallback(() => {
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

  return {
    resizeableStyle,
    isResizeable,
    handlePointDown,
  }
}
