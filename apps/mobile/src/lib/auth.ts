import { expoClient } from "@better-auth/expo/client"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/better-auth`,
  plugins: [
    expoClient({
      scheme: "follow",
      storagePrefix: "follow",
    }),
  ],
})

// @keep-sorted
export const { getCookie, signIn, useSession } = authClient
