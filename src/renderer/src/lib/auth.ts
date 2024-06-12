import { signIn } from "@hono/auth-js/react"

export const LOGIN_CALLBACK_URL = `${import.meta.env.VITE_WEB_URL}/redirect?app=follow`
export const loginHandler = (provider: string) => {
  if (window.electron) {
    window.open(
      `${import.meta.env.VITE_WEB_URL}/login?provider=${provider}`,
    )
  } else {
    signIn(provider, {
      callbackUrl: LOGIN_CALLBACK_URL,
    })
  }
}
