const { expoClient } =
  require("@better-auth/expo/dist/client.js") as typeof import("@better-auth/expo/client")

const { createAuthClient } =
  require("better-auth/dist/react.js") as typeof import("better-auth/react")

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
export const { getCookie, signIn, signOut, useSession } = authClient
