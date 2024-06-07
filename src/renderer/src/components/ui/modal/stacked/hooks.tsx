import { jotaiStore } from "@renderer/lib/jotai"
import { useCallback, useEffect, useId, useRef } from "react"
import { useLocation } from "react-router-dom"

import { modalIdToPropsMap, modalStackAtom } from "./context"
import type { ModalProps, ModalStackOptions } from "./types"

export const useModalStack = (options?: ModalStackOptions) => {
  const id = useId()
  const currentCount = useRef(0)
  const { wrapper } = options || {}
  return {
    present: useCallback(
      (props: ModalProps & { id?: string }) => {
        const modalId = `${id}-${++currentCount.current}`
        jotaiStore.set(modalStackAtom, (p) => {
          const modalProps = {
            ...props,
            id: props.id ?? modalId,
            wrapper,
          }
          modalIdToPropsMap[modalProps.id] = modalProps
          return p.concat(modalProps)
        })

        return () => {
          jotaiStore.set(modalStackAtom, (p) =>
            p.filter((item) => item.id !== modalId))
        }
      },
      [id],
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
