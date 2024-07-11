import type { FallbackRender } from "@sentry/react"
import { ErrorBoundary } from "@sentry/react"
import type { FC, PropsWithChildren } from "react"
import { createElement, useCallback } from "react"

import type { ErrorComponentType } from "../errors"
import { getErrorFallback } from "../errors"

export interface AppErrorBoundaryProps extends PropsWithChildren {
  height?: number | string
  errorType: ErrorComponentType
}

export const AppErrorBoundary: FC<AppErrorBoundaryProps> = ({
  errorType,
  children,
}) => {
  const fallbackRender: FallbackRender = useCallback(
    (fallbackProps) =>
      createElement(getErrorFallback(errorType), fallbackProps),
    [errorType],
  )

  const onError = useCallback((error: unknown, componentStack?: string) => {
    console.error("Uncaught error:", error, componentStack)
  }, [])

  return (
    <ErrorBoundary fallback={fallbackRender} onError={onError}>
      {children}
    </ErrorBoundary>
  )
}
