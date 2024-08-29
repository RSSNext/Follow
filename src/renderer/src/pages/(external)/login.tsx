import { SessionProvider, signIn, useSession } from "@hono/auth-js/react"
import { Logo } from "@renderer/components/icons/logo"
import { Button } from "@renderer/components/ui/button"
import { UserAvatar } from "@renderer/components/user-button"
import { useSignOut } from "@renderer/hooks/biz/useSignOut"
import { LOGIN_CALLBACK_URL, loginHandler } from "@renderer/lib/auth"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export function Component() {
  return (
    <SessionProvider>
      <Login />
    </SessionProvider>
  )
}
function Login() {
  const { status } = useSession()
  const navigate = useNavigate()
  const [redirecting, setRedirecting] = useState(false)
  const signOut = useSignOut()
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const provider = urlParams.get("provider")

  const onContinue = () => {
    if (status === "authenticated") {
      navigate("/redirect?app=follow")
    }
  }

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
    }
  }, [status])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <Logo className="size-20" />
      <h1 className="text-3xl font-bold">
        Log in to
        {` ${APP_NAME}`}
      </h1>
      {redirecting ? (
        <div>Redirecting</div>
      ) : (
        <div className="flex flex-col gap-3">
          {status === "authenticated" ? (
            <>
              <UserAvatar className="gap-8 px-10 py-4 text-2xl" />
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={signOut}>Log out</Button>
                <Button onClick={onContinue}>Continue</Button>
              </div>
            </>
          ) : (
            <>
              <Button
                className="h-[48px] w-[320px] rounded-[8px] !bg-black font-sans text-base text-white hover:!bg-black/80 focus:!border-black/80 focus:!ring-black/80"
                onClick={() => {
                  loginHandler("github")
                }}
              >
                <i className="i-mgc-github-cute-fi mr-2 text-xl" />
                {" "}
                Continue with
                GitHub
              </Button>
              <Button
                className="h-[48px] w-[320px] rounded-[8px] bg-blue-500 font-sans text-base text-white hover:bg-blue-500/90 focus:!border-blue-500/80 focus:!ring-blue-500/80"
                onClick={() => {
                  loginHandler("google")
                }}
              >
                <i className="i-mgc-google-cute-fi mr-2 text-xl" />
                {" "}
                Continue with
                Google
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
