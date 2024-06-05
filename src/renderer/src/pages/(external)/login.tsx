import { signIn, useSession } from "@hono/auth-js/react"
import { Button } from "@renderer/components/ui/button"
import { APP_NAME } from "@renderer/lib/constants"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function Component() {
  const { status } = useSession()
  const navigate = useNavigate()
  const [redirecting, setRedirecting] = useState(false)

  const callbackUrl = `${import.meta.env.VITE_WEB_URL}/redirect?app=follow`

  const urlParams = new URLSearchParams(window.location.search)
  const provider = urlParams.get("provider")
  useEffect(() => {
    if (!window.electron && provider) {
      signIn(provider, {
        callbackUrl,
      })
      setRedirecting(true)
    }
  }, [])

  if (status === "authenticated") {
    navigate("/redirect?app=follow")
    return null
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <img src="./icon.svg" alt="logo" className="size-20" />
      <h1 className="text-3xl font-bold">
        Log in to
        {" "}
        {APP_NAME}
      </h1>
      {redirecting ? (
        <div>Redirecting</div>
      ) : (
        <div className="flex flex-col gap-3">
          <Button
            className="text-lg text-white"
            size="xl"
            onClick={() => {
              if (window.electron) {
                window.open(
                  `${import.meta.env.VITE_WEB_URL}/login?provider=github`,
                )
              } else {
                signIn("github", {
                  callbackUrl,
                })
              }
            }}
          >
            <i className="i-mingcute-github-fill mr-2 text-xl" />
            {" "}
            Continue with
            GitHub
          </Button>
          <Button
            className="bg-blue-500 text-lg text-white hover:bg-blue-500/90"
            size="xl"
            onClick={() => {
              if (window.electron) {
                window.open(
                  `${import.meta.env.VITE_WEB_URL}/login?provider=google`,
                )
              } else {
                signIn("google", {
                  callbackUrl,
                })
              }
            }}
          >
            <i className="i-mingcute-google-fill mr-2 text-xl" />
            {" "}
            Continue with
            Google
          </Button>
        </div>
      )}
    </div>
  )
}
