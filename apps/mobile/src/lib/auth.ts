import { useQuery } from "@tanstack/react-query"
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
export const { getCookie, signIn, signOut, useSession } = authClient

export const useAuthToken = () => {
  const query = useQuery({
    queryKey: ["cookie"],
    queryFn: getCookie,
  })
  return {
    ...query,
    data: query.data ? parse(query.data)["better-auth.session_token"] : null,
  }
}
