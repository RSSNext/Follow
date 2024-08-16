// @ts-nocheck
import "fake-indexeddb/auto"

import { enableMapSet } from "immer"

globalThis.window = {
  location: new URL("https://example.com"),
  __dbIsReady: true,
}

if (!globalThis.navigator) {
  globalThis.navigator = {
    onLine: true,
  }
}
enableMapSet()
