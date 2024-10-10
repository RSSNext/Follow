import { SessionProvider, signIn, useSession } from "@hono/auth-js/react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"

import { Logo } from "~/components/icons/logo"
import { Button } from "~/components/ui/button"
import { useSignOut } from "~/hooks/biz/useSignOut"
import { LOGIN_CALLBACK_URL, loginHandler } from "~/lib/auth"
import { UserAvatar } from "~/modules/user/UserAvatar"

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

  const isAuthenticated = status === "authenticated"
  const onOpenInWebApp = () => {
    if (isAuthenticated) {
      navigate("/")
    }
  }

  const { t } = useTranslation("external")

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
      {!isAuthenticated ? (
        <h1 className="text-3xl font-bold">
          {t("login.logInTo")}
          {` ${APP_NAME}`}
        </h1>
      ) : (
        <h1 className="-mb-6 text-3xl font-bold">
          {t("login.welcomeTo")}
          {` ${APP_NAME}`}
        </h1>
      )}
      {redirecting ? (
        <div>{t("login.redirecting")}</div>
      ) : (
        <div className="flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <div className="center flex">
                <UserAvatar className="gap-8 px-10 py-4 text-2xl" />
                <Button variant="ghost" onClick={signOut}>
                  <i className="i-mingcute-exit-line" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={onOpenInWebApp}>
                  {t("login.backToWebApp")}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    navigate("/redirect?app=follow")
                  }}
                >
                  {t("login.openApp")}
                </Button>
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
                <i className="i-mgc-github-cute-fi mr-2 text-xl" /> {t("login.continueWithGitHub")}
              </Button>
              <Button
                className="h-[48px] w-[320px] rounded-[8px] bg-blue-500 font-sans text-base text-white hover:bg-blue-500/90 focus:!border-blue-500/80 focus:!ring-blue-500/80"
                onClick={() => {
                  loginHandler("google")
                }}
              >
                <i className="i-mgc-google-cute-fi mr-2 text-xl" /> {t("login.continueWithGoogle")}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
