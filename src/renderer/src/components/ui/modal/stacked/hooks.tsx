import { getUISettings } from "@renderer/atoms"
import { jotaiStore } from "@renderer/lib/jotai"
import { useCallback, useContext, useEffect, useId, useRef } from "react"
import { useLocation } from "react-router-dom"

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
          jotaiStore.set(modalStackAtom, (p) =>
            p.filter((item) => item.id !== modalId))
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
export const useDismissAllWhenRouterChange = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    actions.dismissAll()
  }, [pathname])
}

export const useCurrentModal = () => useContext(CurrentModalContext)
