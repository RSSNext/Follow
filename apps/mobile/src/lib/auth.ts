import { useQuery } from "@tanstack/react-query"
import type * as better_call from "better-call"
import { parse } from "cookie-es"

import { kv } from "./kv"
import { queryClient } from "./query-client"

const { expoClient } =
  require("@better-auth/expo/dist/client.js") as typeof import("@better-auth/expo/client")

const { createAuthClient } =
  require("better-auth/dist/react.js") as typeof import("better-auth/react")

const storagePrefix = "follow_auth"
const authClient = createAuthClient({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/better-auth`,
  plugins: [
    {
      id: "getProviders",
      $InferServerPlugin: {} as (typeof authPlugins)[0],
    },
    expoClient({
      scheme: "follow",
      storagePrefix,
      storage: {
        setItem(key, value) {
          kv.setSync(key, value)
          if (key === `${storagePrefix}_cookie`) {
            queryClient.invalidateQueries({ queryKey: ["cookie"] })
          }
        },
        getItem(key) {
          return kv.getSync(key)
        },
      },
    }),
  ],
})

// @keep-sorted
export const { getCookie, getProviders, signIn, signOut, useSession } = authClient

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

export const useAuthToken = () => {
  const query = useQuery({
    queryKey: ["cookie"],
    queryFn: getCookie,
  })
  return {
    ...query,
    data: query.data ? parse(query.data)["__Secure-better-auth.session_token"] : null,
  }
}

// eslint-disable-next-line unused-imports/no-unused-vars
declare const authPlugins: {
  id: "getProviders"
  endpoints: {
    getProviders: {
      <
        C extends [
          (
            | better_call.Context<
                "/get-providers",
                {
                  method: "GET"
                }
              >
            | undefined
          )?,
        ],
      >(
        ...ctx: C
      ): Promise<
        C extends [
          {
            asResponse: true
          },
        ]
          ? Response
          : Record<string, AuthProvider>
      >
      path: "/get-providers"
      options: {
        method: "GET"
      }
      method: better_call.Method | better_call.Method[]
      headers: Headers
    }
  }
}[]
