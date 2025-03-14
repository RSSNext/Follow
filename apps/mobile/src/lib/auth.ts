import { expoClient } from "@better-auth/expo/client"
import type { authPlugins } from "@follow/shared/src/hono"
import { useQuery } from "@tanstack/react-query"
import { inferAdditionalFields, twoFactorClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import type { BetterAuthClientPlugin } from "better-auth/types"
import * as SecureStore from "expo-secure-store"

import { isNewUserQueryKey } from "../store/user/constants"
import { whoamiQueryKey } from "../store/user/hooks"
import { proxyEnv } from "./proxy-env"
import { queryClient } from "./query-client"

const storagePrefix = "follow_auth"
export const cookieKey = `${storagePrefix}_cookie`
export const sessionTokenKey = "__Secure-better-auth.session_token"

type AuthPlugin = (typeof authPlugins)[number]

const serverPlugins = [
  {
    id: "customGetProviders",
    $InferServerPlugin: {} as Extract<AuthPlugin, { id: "customGetProviders" }>,
  },
  {
    id: "customCreateSession",
    $InferServerPlugin: {} as Extract<AuthPlugin, { id: "customCreateSession" }>,
  },
  {
    id: "getAccountInfo",
    $InferServerPlugin: {} as Extract<AuthPlugin, { id: "getAccountInfo" }>,
  },
  inferAdditionalFields({
    user: {
      handle: {
        type: "string",
        required: false,
      },
    },
  }),
] satisfies BetterAuthClientPlugin[]

const authClient = createAuthClient({
  baseURL: `${proxyEnv.VITE_API_URL}/better-auth`,
  plugins: [
    twoFactorClient(),
    {
      id: "getProviders",
      $InferServerPlugin: {} as (typeof authPlugins)[0],
    },
    ...serverPlugins,
    expoClient({
      scheme: "follow",
      storagePrefix,
      storage: {
        setItem(key, value) {
          SecureStore.setItem(key, value)
          if (key === cookieKey) {
            queryClient.invalidateQueries({ queryKey: whoamiQueryKey })
            queryClient.invalidateQueries({ queryKey: isNewUserQueryKey })
          }
        },
        getItem: SecureStore.getItem,
      },
    }),
  ],
})

// @keep-sorted
export const {
  changeEmail,
  changePassword,
  forgetPassword,
  getAccountInfo,
  getCookie,
  getProviders,
  linkSocial,
  sendVerificationEmail,
  signIn,
  signOut,
  signUp,
  twoFactor,
  unlinkAccount,
  updateUser,
  useSession,
} = authClient

export interface AuthProvider {
  name: string
  id: string
  color: string
  icon: string
}

export const useAuthProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: async () => (await getProviders()).data,
  })
}
