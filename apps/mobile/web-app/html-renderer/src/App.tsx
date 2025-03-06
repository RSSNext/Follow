import { createStore, Provider, useAtomValue } from "jotai"

import type { EntryModel } from "../types"
import {
  codeThemeDarkAtom,
  codeThemeLightAtom,
  entryAtom,
  noMediaAtom,
  readerRenderInlineStyleAtom,
  showSourceAtom,
} from "./atoms"
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
  setReaderRenderInlineStyle(value: boolean) {
    store.set(readerRenderInlineStyleAtom, value)
  },
  setNoMedia(value: boolean) {
    store.set(noMediaAtom, value)
  },
  setShowSource(value: boolean) {
    store.set(showSourceAtom, value)
  },
  reset() {
    store.set(entryAtom, null)
    bridge.measure()
  },
})

export const App = () => {
  const entry = useAtomValue(entryAtom, { store })
  const readerRenderInlineStyle = useAtomValue(readerRenderInlineStyleAtom, { store })
  const noMedia = useAtomValue(noMediaAtom, { store })
  const showSource = useAtomValue(showSourceAtom, { store })

  return (
    <Provider store={store}>
      <HTML
        children={showSource ? entry?.sourceContent : entry?.content || entry?.sourceContent}
        renderInlineStyle={readerRenderInlineStyle}
        noMedia={noMedia}
      />
    </Provider>
  )
}
