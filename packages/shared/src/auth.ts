import { env } from "@follow/shared/env"
import type { authPlugins } from "@follow/shared/hono"
import type { BetterAuthClientPlugin } from "better-auth/client"
import { createAuthClient } from "better-auth/react"

import { IN_ELECTRON, WEB_URL } from "./constants"

const serverPlugins = [
  {
    id: "getProviders",
    $InferServerPlugin: {} as (typeof authPlugins)[0],
  },
  {
    id: "createSession",
    $InferServerPlugin: {} as (typeof authPlugins)[1],
  },
] satisfies BetterAuthClientPlugin[]

const authClient = createAuthClient({
  baseURL: `${env.VITE_API_URL}/better-auth`,
  plugins: serverPlugins,
})

export const {
  signIn,
  signOut,
  getSession,
  getProviders,
  createSession,
  linkSocial,
  listAccounts,
  changePassword,
  forgetPassword,
  resetPassword,
} = authClient

export const LOGIN_CALLBACK_URL = `${WEB_URL}/login`
export type LoginRuntime = "browser" | "app"
export const loginHandler = async (
  provider: string,
  args?: {
    runtime?: LoginRuntime
    email?: string
    password?: string
  },
) => {
  const { runtime = "app", email, password } = args ?? {}
  if (IN_ELECTRON) {
    window.open(`${WEB_URL}/login?provider=${provider}`)
  } else {
    if (provider === "credential") {
      if (!email || !password) return
      return signIn.email({ email, password })
    }

    signIn.social({
      provider: provider as "google" | "github" | "apple",
      callbackURL: runtime === "app" ? LOGIN_CALLBACK_URL : undefined,
    })
  }
}
