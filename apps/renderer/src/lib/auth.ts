import { WEB_URL } from "@follow/shared/constants"
import { signIn } from "@hono/auth-js/react"

export const LOGIN_CALLBACK_URL = `${WEB_URL}/redirect?app=follow`
export type LoginRuntime = "browser" | "app"
export const loginHandler = (provider: string, runtime: LoginRuntime = "app") => {
  if (window.electron) {
    window.open(`${WEB_URL}/login?provider=${provider}`)
  } else {
    signIn(provider, {
      callbackUrl: runtime === "app" ? LOGIN_CALLBACK_URL : WEB_URL,
    })
  }
}
