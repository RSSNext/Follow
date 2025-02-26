import * as React from "react"
import { useEffect, useMemo, useRef } from "react"

import PortalContext from "./PortalContext"
import type { IPortalMethods, PortalConsumerProps } from "./type"

const PortalConsumer: React.FC<PortalConsumerProps> = (props) => {
  const id = React.useId()
  const key = useRef<string>(id)
  const once = useRef<boolean>(false)

  useEffect(
    () => () => {
      const { manager } = props
      manager?.unmount?.(key.current)
    },

    [],
  )

  useEffect(() => {
    const { manager, children } = props
    if (!once.current) {
      once.current = true
      key.current = manager?.mount?.(children) ?? ""
    } else {
      manager?.update?.(key.current, children)
    }
  }, [props])

  return null
}

export function Portal({ children }: React.PropsWithChildren) {
  return useMemo(
    () => (
      <PortalContext.Consumer>
        {(manager: IPortalMethods | null): React.ReactNode => (
          <PortalConsumer manager={manager}>{children}</PortalConsumer>
        )}
      </PortalContext.Consumer>
    ),
    [children],
  )
}

export { PortalConsumerProps, PortalProps } from "./type"
