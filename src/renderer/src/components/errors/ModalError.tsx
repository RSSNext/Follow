import { repository } from "@pkg"
import { attachOpenInEditor } from "@renderer/lib/dev"
import type { FallbackRender } from "@sentry/react"
import type { FC } from "react"

import { m } from "../common/Motion"
import { StyledButton } from "../ui/button"
import { useCurrentModal } from "../ui/modal"
import { parseError } from "./helper"

export const ModalErrorFallback: FC<Parameters<FallbackRender>[0]> = (
  props,
) => {
  const { message, stack } = parseError(props.error)
  const modal = useCurrentModal()
  return (
    <m.div
      className="flex flex-col items-center justify-center rounded-md bg-theme-modal-background-opaque p-2"
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
    >
      <div className="m-auto max-w-prose text-center">
        <div className="mb-4">
          <i className="i-mgc-bug-cute-re text-4xl text-red-500" />
        </div>
        <div className="text-lg font-bold">{message}</div>
        {import.meta.env.DEV && stack ? (
          <div className="mt-4 cursor-text overflow-auto whitespace-pre rounded-md bg-red-50 p-4 font-mono text-sm text-red-600">
            {attachOpenInEditor(stack)}
          </div>
        ) : null}

        <p className="my-8">
          The App has a temporary problem, click the button below to try
          reloading the app or another solution?
        </p>

        <div className="center gap-4">
          <StyledButton onClick={() => modal.dismiss()} variant="outline">
            Close Modal
          </StyledButton>
          <StyledButton
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reload
          </StyledButton>
        </div>

        <p className="mt-8">
          Still having this issue? Please give feedback in Github, thanks!
          <a
            className="ml-2 cursor-pointer text-theme-accent-500 duration-200 hover:text-theme-accent"
            href={`${repository.url}/issues/new?title=${encodeURIComponent(
              `Error: ${message}`,
            )}&body=${encodeURIComponent(
              `### Error\n\n${message}\n\n### Stack\n\n\`\`\`\n${stack}\n\`\`\``,
            )}&label=bug`}
            target="_blank"
            rel="noreferrer"
          >
            Submit Issue
          </a>
        </p>
      </div>
    </m.div>
  )
}
