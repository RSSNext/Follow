import type { PropsWithChildren } from "react"
import { createContext, useContext, useState } from "react"

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = createContext<StateContext>(false)
const setContext = createContext<SetContext>((_: boolean) => {})

export function DrawerSwipeProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(false)
  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setState}>{children}</setContext.Provider>
    </stateContext.Provider>
  )
}

export function useIsDrawerSwipeDisabled() {
  return useContext(stateContext)
}

export function useSetDrawerSwipeDisabled() {
  return useContext(setContext)
}
