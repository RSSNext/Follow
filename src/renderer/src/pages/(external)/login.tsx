import { signIn, useSession } from "@hono/auth-js/react"
import { Button } from "@renderer/components/ui/button"
import { useSignOut } from "@renderer/hooks"
import { LOGIN_CALLBACK_URL, loginHandler } from "@renderer/lib/auth"
import { APP_NAME } from "@renderer/lib/constants"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function Component() {
  const { status } = useSession()
  const navigate = useNavigate()
  const [redirecting, setRedirecting] = useState(false)
  const signOut = useSignOut()

  const urlParams = new URLSearchParams(window.location.search)
  const provider = urlParams.get("provider")
  useEffect(() => {
    if (!window.electron && provider) {
      if (status === "authenticated") {
        signOut()
      }
      if (status === "unauthenticated") {
        signIn(provider, {
          callbackUrl: LOGIN_CALLBACK_URL,
        })
      }
      setRedirecting(true)
    } else if (status === "authenticated") {
      navigate("/redirect?app=follow")
    }
  }, [status])

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
            className="!bg-black text-lg text-white"
            size="xl"
            onClick={() => {
              loginHandler("github")
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
              loginHandler("google")
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
