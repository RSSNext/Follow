import type { FC } from "react"
import { createElement, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

import { nextFrame } from "~/lib/dom"
import { createErrorToaster } from "~/lib/error-parser"

import type { AppErrorFallbackProps } from "../common/AppErrorBoundary"

export const parseError = (error: unknown): { message?: string; stack?: string } => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    }
  } else {
    return {
      message: String(error),
      stack: undefined,
    }
  }
}

// TODO: move this
export class CustomSafeError extends Error {
  constructor(message: string, toast?: boolean) {
    super(message)
    if (toast) {
      nextFrame(() => createErrorToaster(message)(this))
    }
  }
}

export const useResetErrorWhenRouteChange = (resetError: () => void) => {
  const location = useLocation()
  const currentPathnameRef = useRef(location.pathname)
  const onceRef = useRef(false)
  useEffect(() => {
    if (onceRef.current) {
      return
    }
    if (currentPathnameRef.current !== location.pathname) {
      resetError()
      onceRef.current = true
    }
  }, [location.pathname])
}

export const withErrorGrand = <T extends Error, S extends new (...args: any[]) => T>(
  error: S,
  Component: FC<AppErrorFallbackProps>,
): FC<AppErrorFallbackProps> => {
  return (props: AppErrorFallbackProps) => {
    if (!(props.error instanceof error)) {
      throw error
    }

    return createElement(Component, props)
  }
}
