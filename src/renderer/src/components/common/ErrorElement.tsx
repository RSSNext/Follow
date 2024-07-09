import { repository } from "@pkg"
import { clearLocalPersistStoreData } from "@renderer/store/utils/clear"
import { useEffect } from "react"
import { isRouteErrorResponse, useRouteError } from "react-router-dom"

import { StyledButton } from "../ui/button"

export const ErrorElement = DefaultErrorComponent

function DefaultErrorComponent() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error) ?
    `${error.status} ${error.statusText}` :
    error instanceof Error ?
      error.message :
      JSON.stringify(error)
  const stack = error instanceof Error ? error.stack : null

  useEffect(() => {
    console.error(
      "Error handled by React Router default ErrorBoundary:",
      error,
    )
    import("@sentry/react").then(({ captureException }) => {
      captureException(error)
    })
  }, [error])

  return (
    <div className="select-text p-8">
      <div className="drag-region fixed inset-x-0 top-0 h-12" />

      <h2 className="mt-12 text-2xl">Unexpected Application Error!</h2>
      <h3 className="text-xl">{message}</h3>
      {import.meta.env.DEV && stack ? (
        <div className="mt-4 cursor-text overflow-auto whitespace-pre rounded-md bg-red-50 p-4 font-mono text-sm text-red-600">
          {attachOpenInEditor(stack)}
        </div>
      ) : null}

      <p className="my-8">
        The App has a temporary problem, click the button below to try reloading
        the app or another solution?
      </p>

      <div className="center gap-4">
        <StyledButton
          variant="outline"
          onClick={() => {
            clearLocalPersistStoreData()
            window.location.href = "/"
          }}
        >
          Reset Local Database
        </StyledButton>
        <StyledButton onClick={() => (window.location.href = "/")}>
          Reload
        </StyledButton>
      </div>

      <p className="mt-8">
        Still having this issue? Please give feedback in Github, thanks!
        <a
          className="ml-2 cursor-pointer text-theme-accent-400/80 duration-200 hover:text-theme-accent"
          href={`${repository.url}/issues/new?title=${encodeURIComponent(
            `Error: ${message}`,
          )}&body=${encodeURIComponent(
            `### Error\n\n${message}\n\n### Stack\n\n\`\`\`\n${stack}\n\`\`\``,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          Submit Issue
        </a>
      </p>
    </div>
  )
}
const attachOpenInEditor = (stack: string) => {
  const lines = stack.split("\n")
  return lines.map((line) => {
    // A line like this: at App (http://localhost:5173/src/App.tsx?t=1720527056591:41:9)
    // Find the `localhost` part and open the file in the editor
    if (!line.includes("at ")) {
      return line
    }
    const match = line.match(/(http:\/\/localhost:\d+\/[^:]+):(\d+):(\d+)/)

    if (match) {
      const [o] = match

      // Find `@fs/`
      // Like: `http://localhost:5173/@fs/Users/innei/git/work/rss3/follow/node_modules/.vite/deps/chunk-RPCDYKBN.js?v=757920f2:11548:26`
      const realFsPath = o.split("@fs")[1]

      if (realFsPath) {
        return (
          // Delete `v=` hash, like `v=757920f2`
          <div
            className="cursor-pointer"
            key={line}
            onClick={openInEditor.bind(
              null,
              realFsPath.replace(/\?v=[a-f0-9]+/, ""),
            )}
          >
            {line}
          </div>
        )
      } else {
        // at App (http://localhost:5173/src/App.tsx?t=1720527056591:41:9)
        const srcFsPath = o.split("/src")[1]

        if (srcFsPath) {
          const fs = srcFsPath.replace(/\?t=[a-f0-9]+/, "")

          return (
            <div
              className="cursor-pointer"
              key={line}
              onClick={openInEditor.bind(
                null,
                `${APP_DEV_CWD}/src/renderer/src${fs}`,
              )}
            >
              {line}
            </div>
          )
        }
      }
    }

    return line
  })
}
// http://localhost:5173/src/App.tsx?t=1720527056591:41:9
const openInEditor = (file: string) => {
  fetch(`/__open-in-editor?file=${encodeURIComponent(`${file}`)}`)
}
