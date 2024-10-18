import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

import { nextFrame } from "~/lib/dom"
import { createErrorToaster } from "~/lib/error-parser"

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
