import { appIsReady } from "@renderer/atoms/app"

const afterReadyCallbackQueue = [] as Array<() => void>

export const pushAfterReadyCallback = (callback: () => void) => {
  if (appIsReady()) {
    callback()
  } else {
    afterReadyCallbackQueue.push(callback)
  }
}

export const applyAfterReadyCallbacks = () => {
  afterReadyCallbackQueue.forEach((callback) => callback())
  afterReadyCallbackQueue.length = 0
}
