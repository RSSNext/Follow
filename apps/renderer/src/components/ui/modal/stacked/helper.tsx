import type { Enable } from "re-resizable"
import type { Context, PropsWithChildren } from "react"
import { memo, useContext } from "react"

export const InjectContext = (context: Context<any>) => {
  const ctxValue = useContext(context)
  return memo(({ children }: PropsWithChildren) => (
    <context.Provider value={ctxValue}>{children}</context.Provider>
  ))
}

export function resizableOnly(...positions: (keyof Enable)[]) {
  const enable: Enable = {
    top: false,
    right: false,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  }

  for (const position of positions) {
    enable[position] = true
  }
  return enable
}
