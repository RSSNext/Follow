import { nextFrame } from "@follow/utils/dom"
import { jotaiStore } from "@follow/utils/jotai"
import { atom } from "jotai"

const historyAtom = atom<string[]>([])

declare global {
  interface History {
    stack: string[]

    returnBack: () => void
  }
}

export const registerHistoryStack = () => {
  const onPopState = (e: PopStateEvent) => {
    const url = e.state?.url
    if (url) {
      jotaiStore.set(historyAtom, jotaiStore.get(historyAtom).slice(0, -1))
    }
  }
  window.addEventListener("popstate", onPopState)

  // Push
  const originalPushState = window.history.pushState
  window.history.pushState = (...args) => {
    const url = args[2] as string
    jotaiStore.set(historyAtom, [...jotaiStore.get(historyAtom), url])
    return originalPushState(...args)
  }

  Object.defineProperty(window.history, "stack", {
    get() {
      return jotaiStore.get(historyAtom)
    },
    enumerable: false,
  })

  Object.defineProperty(window.history, "returnBack", {
    value: () => {
      const stack = jotaiStore.get(historyAtom)
      const last = stack.at(-1)
      if (last) {
        window.history.back()
      } else {
        window.router.navigate("/")

        nextFrame(() => {
          jotaiStore.set(historyAtom, [])
        })
      }
    },
    enumerable: false,
  })

  return () => {
    window.removeEventListener("popstate", onPopState)
    window.history.pushState = originalPushState
  }
}
