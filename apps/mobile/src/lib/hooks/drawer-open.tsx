import type { PropsWithChildren } from "react"
import { createContext, useCallback, useContext, useState } from "react"

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = createContext<StateContext>(false)
const setContext = createContext<SetContext>((_: boolean) => {
  throw new Error(
    "Failed to set drawer state! Do you have a `DrawerStateProvider` in your component tree?",
  )
})

export function DrawerStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(false)

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setState}>{children}</setContext.Provider>
    </stateContext.Provider>
  )
}
DrawerStateProvider.displayName = "DrawerStateProvider"

export function useFeedDrawer() {
  const state = useContext(stateContext)
  const setState = useContext(setContext)

  return {
    isDrawerOpen: state,
    openDrawer: useCallback(() => setState(true), [setState]),
    closeDrawer: useCallback(() => setState(false), [setState]),
    toggleDrawer: useCallback(() => setState(!state), [setState, state]),
  }
}
