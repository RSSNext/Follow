import { nextFrame } from "@follow/utils/dom"
import { jotaiStore } from "@follow/utils/jotai"
import { atom } from "jotai"

const historyAtom = atom<string[]>([])

declare global {
  interface History {
    stack: string[]

    returnBack: () => void

    get isPop(): boolean
  }
}

let __isPop = false
const F = {} as { isPop: boolean }
let resetTimer: any = null
Object.defineProperty(F, "isPop", {
  get() {
    return __isPop
  },
  set(value) {
    if (!value) return

    resetTimer && clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      __isPop = false
    }, 1200)

    __isPop = true
  },
})
export const registerHistoryStack = () => {
  const onPopState = (e: PopStateEvent) => {
    F.isPop = true

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
      F.isPop = true

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

  Object.defineProperty(window.history, "isPop", {
    get() {
      return F.isPop
    },
    enumerable: false,
  })

  return () => {
    window.removeEventListener("popstate", onPopState)
    window.history.pushState = originalPushState
  }
}
