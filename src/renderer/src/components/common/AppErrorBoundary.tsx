import type { FallbackRender } from "@sentry/react"
import { ErrorBoundary } from "@sentry/react"
import type { FC, PropsWithChildren } from "react"
import { useCallback } from "react"

export interface AppErrorBoundaryProps extends PropsWithChildren {
  height?: number | string
}

export const AppErrorBoundary: FC<AppErrorBoundaryProps> = (props) => {
  const fallbackRender: FallbackRender = useCallback(
    (fallbackProps) => (
      <ErrorFallback {...fallbackProps} height={props.height} />
    ),
    [props.height],
  )

  const onError = useCallback((error: unknown, componentStack?: string) => {
    console.error("Uncaught error:", error, componentStack)
  }, [])

  return (
    <ErrorBoundary fallback={fallbackRender} onError={onError}>
      {props.children}
    </ErrorBoundary>
  )
}

export type AppErrorFallbackProps = Parameters<FallbackRender>[0] & {
  height?: number | string
}

const ErrorFallback = (_props: AppErrorFallbackProps) => <div>App has crashed</div>
