import { ModalErrorFallback } from "./ModalError"
import { PageErrorFallback } from "./PageError"

export enum ErrorComponentType {
  Modal = "Modal",
  Page = "Page",
}

export const ErrorFallbackMap = {
  [ErrorComponentType.Modal]: ModalErrorFallback,
  [ErrorComponentType.Page]: PageErrorFallback,
}

export const getErrorFallback = (type: ErrorComponentType) =>
  ErrorFallbackMap[type]
