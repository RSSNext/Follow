import pkg from "@pkg"
import { isElectronBuild } from "@renderer/constants"
import { captureException } from "@sentry/react"
import { useEffect } from "react"
import type { Location } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"

import { Logo } from "../icons/logo"
import { StyledButton } from "../ui/button"

class AccessNotFoundError extends Error {
  constructor(
    message: string,
    public path: string,
    public location: Location<any>,
  ) {
    super(message)
    this.name = "AccessNotFoundError"
  }

  toString() {
    return `${this.name}: ${this.message} at ${this.path}`
  }
}
export const NotFound = () => {
  const location = useLocation()
  useEffect(() => {
    if (!isElectronBuild) {
      return
    }
    captureException(
      new AccessNotFoundError(
        "Electron app got to a 404 page, this should not happen",
        location.pathname,
        location,
      ),
    )
  }, [location])
  const navigate = useNavigate()
  return (
    <div className="prose center m-auto size-full flex-col dark:prose-invert">
      <main className="flex grow flex-col items-center justify-center">
        <div className="center mb-8 flex">
          <Logo className="size-20" />
        </div>
        <p className="font-semibold">
          You have come to a desert of knowledge where there is nothing.
        </p>
        <p>
          Current path:
          {" "}
          <code>{location.pathname}</code>
        </p>

        <p>
          <StyledButton onClick={() => navigate("/")}>
            Back to Home
          </StyledButton>
        </p>
      </main>

      <footer className="center -mt-12 flex gap-2 py-8">
        Powered by
        {" "}
        <Logo className="size-5" />
        {" "}
        <a
          href={pkg.homepage}
          className="cursor-pointer font-bold text-theme-accent no-underline"
          target="_blank"
          rel="noreferrer"
        >
          {APP_NAME}
        </a>
      </footer>
    </div>
  )
}
