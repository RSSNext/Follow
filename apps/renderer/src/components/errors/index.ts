import { ErrorComponentType } from "./enum"
import { FeedFoundCanBeFollowErrorFallback } from "./FeedFoundCanBeFollowErrorFallback"
import { FeedNotFoundErrorFallback } from "./FeedNotFound"
import { ModalErrorFallback } from "./ModalError"
import { PageErrorFallback } from "./PageError"

const ErrorFallbackMap = {
  [ErrorComponentType.Modal]: ModalErrorFallback,
  [ErrorComponentType.Page]: PageErrorFallback,
  [ErrorComponentType.FeedFoundCanBeFollow]: FeedFoundCanBeFollowErrorFallback,
  [ErrorComponentType.FeedNotFound]: FeedNotFoundErrorFallback,
}

export const getErrorFallback = (type: ErrorComponentType) => ErrorFallbackMap[type]
