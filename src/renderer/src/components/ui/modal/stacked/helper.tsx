import type { Context, PropsWithChildren } from "react"
import { memo, useContext } from "react"

export const InjectContext = (context: Context<any>) => {
  const ctxValue = useContext(context)
  return memo(({ children }: PropsWithChildren) => (
    <context.Provider value={ctxValue}>{children}</context.Provider>
  ))
}
