import { createStore, Provider, useAtomValue } from "jotai"

import { codeThemeDarkAtom, codeThemeLightAtom, entryAtom } from "../atoms"
import type { EntryModel } from "../types"
import { HTML } from "./HTML"

const store = createStore()

Object.assign(window, {
  setEntry(entry: EntryModel) {
    store.set(entryAtom, entry)
    bridge.measure()
  },
  setCodeTheme(light: string, dark: string) {
    store.set(codeThemeLightAtom, light)
    store.set(codeThemeDarkAtom, dark)
  },
  reset() {
    store.set(entryAtom, null)
    bridge.measure()
  },
})

export const App = () => {
  const entry = useAtomValue(entryAtom, { store })

  return (
    <Provider store={store}>
      <HTML children={entry?.content} />
    </Provider>
  )
}
