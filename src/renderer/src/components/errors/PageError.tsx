import { attachOpenInEditor } from "@renderer/lib/dev"
import type { FC } from "react"

import type { AppErrorFallbackProps } from "../common/AppErrorBoundary"
import { FallbackIssue } from "../common/ErrorElement"
import { StyledButton } from "../ui/button"
import { parseError } from "./helper"

export const PageErrorFallback: FC<AppErrorFallbackProps> = (props) => {
  const { message, stack } = parseError(props.error)

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-md bg-theme-modal-background-opaque p-2">
      <div className="m-auto max-w-prose text-center">
        <div className="mb-4">
          <i className="i-mgc-bug-cute-re text-4xl text-red-500" />
        </div>
        <div className="text-lg font-bold">{message}</div>
        {import.meta.env.DEV && stack ? (
          <div className="mt-4 cursor-text overflow-auto whitespace-pre rounded-md bg-red-50 p-4 text-left font-mono text-sm text-red-600">
            {attachOpenInEditor(stack)}
          </div>
        ) : null}

        <p className="my-8">
          The App has a temporary problem, click the button below to try
          reloading the app or another solution?
        </p>

        <div className="center gap-4">
          <StyledButton onClick={() => props.resetError()} variant="primary">
            Retry
          </StyledButton>

          <StyledButton
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reload
          </StyledButton>
        </div>

        <FallbackIssue message={message!} stack={stack} />
      </div>
    </div>
  )
}
