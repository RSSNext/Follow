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

export const { signIn, signOut, getSession, getProviders, createSession } = authClient

export const loginHandler = (provider: string) => {
  if (IN_ELECTRON) {
    window.open(`${WEB_URL}/login?provider=${provider}`)
  } else {
    signIn.social({
      provider: provider as "google" | "github" | "apple",
    })
  }
}
