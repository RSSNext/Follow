import { atom, createStore, useAtomValue } from "jotai"

import { HTML } from "./HTML"

interface MediaModel {
  url: string
  type: "photo" | "video"
  preview_image_url?: string
  width?: number
  height?: number
  blurhash?: string
}

interface EntryModel {
  content: string
  title: string
  media: MediaModel[]
}

const store = createStore()
const entryAtom = atom<EntryModel | null>(null)

declare global {
  interface Window {
    webkit: {
      messageHandlers: Record<
        string,
        {
          postMessage: (message?: string) => void
        }
      >
    }
  }
}

const birdage = {
  measure() {
    window.webkit.messageHandlers?.measure?.postMessage?.()
  },
}

Object.assign(window, {
  setEntry(entry: EntryModel) {
    store.set(entryAtom, entry)
    birdage.measure()
  },
  reset() {
    store.set(entryAtom, null)
    birdage.measure()
  },
})

export const App = () => {
  const entry = useAtomValue(entryAtom, { store })

  return <HTML children={entry?.content} />
}
