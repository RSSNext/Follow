import * as React from "react"
import { useCallback, useMemo, useRef } from "react"

import PortalContext from "./PortalContext"
import PortalManager from "./PortalManager"
import type { IPortalManager, Operation, PortalKey } from "./type"

interface PortalHostProps {
  children: React.ReactNode
}

export function PortalHost(props: PortalHostProps) {
  const id = React.useId()
  const nextKey = useRef(0)
  const queue = useRef<Operation[]>([])
  const manager = useRef<IPortalManager>()

  const mount = useCallback((children: React.ReactNode, _key?: PortalKey) => {
    let key = _key
    if (!key) {
      nextKey.current++
      key = `${id}-${nextKey.current}`
    }

    if (manager.current) {
      manager.current.mount(key, children)
    } else {
      queue.current.push({ type: "mount", key, children })
    }

    return key
  }, [])

  const update = useCallback((key: PortalKey, children: React.ReactNode) => {
    if (manager.current) {
      manager.current.update(key, children)
    } else {
      const op: Operation = { type: "mount", key, children }
      const index = queue.current.findIndex(
        (o) => o.type === "mount" || (o.type === "update" && o.key === key),
      )

      if (index !== -1) {
        queue.current[index] = op
      } else {
        queue.current.push(op)
      }
    }
  }, [])

  const unmount = useCallback((key: PortalKey) => {
    if (manager.current) {
      manager.current.unmount(key)
    } else {
      queue.current.push({ type: "unmount", key })
    }
  }, [])

  const { children } = props

  const ctxValue = useMemo(
    () => ({
      mount,
      update,
      unmount,
    }),
    [mount, update, unmount],
  )

  return useMemo(
    () => (
      <>
        <PortalContext.Provider value={ctxValue}>
          <>
            {/* placeholder */}
            {children}
            {/* portal container */}
            <PortalManager ref={manager} />
          </>
        </PortalContext.Provider>
      </>
    ),
    [ctxValue, children],
  )
}

PortalHost.displayName = "Portal.host"
