import { lazy } from "react"

import { ErrorComponentType } from "./enum"

const ErrorFallbackMap = {
  [ErrorComponentType.Modal]: lazy(() => import("./ModalError")),
  [ErrorComponentType.Page]: lazy(() => import("./PageError")),
  [ErrorComponentType.FeedFoundCanBeFollow]: lazy(
    () => import("./FeedFoundCanBeFollowErrorFallback"),
  ),
  [ErrorComponentType.FeedNotFound]: lazy(() => import("./FeedNotFound")),
}

export const getErrorFallback = (type: ErrorComponentType) => ErrorFallbackMap[type]
