import { ModalErrorFallback } from "./ModalError"

export enum ErrorComponentType {
  Modal = "Modal",
}

export const ErrorFallbackMap = {
  [ErrorComponentType.Modal]: ModalErrorFallback,
}

export const getErrorFallback = (type: ErrorComponentType) => ErrorFallbackMap[type]
