import CookieManager from "@react-native-cookies/cookies"
import * as Linking from "expo-linking"
import { Redirect, useLocalSearchParams } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import { useMemo } from "react"
import { Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { queryClient } from "@/src/lib/query-client"

function obtainAuthToken() {
  return new Promise<string>((resolve, reject) => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const { hostname, queryParams } = Linking.parse(url)
      if (hostname === "auth" && queryParams !== null && typeof queryParams.ck === "string") {
        WebBrowser.dismissBrowser()
        const { ck } = queryParams

        const cookie = atob(ck)
        const token = cookie.split("=")[1]

        CookieManager.set(process.env.EXPO_PUBLIC_API_URL, {
          name: "better-auth.session_token",
          value: token,
          httpOnly: true,
        }).then((done) => {
          if (done) {
            resolve(ck)
            queryClient.invalidateQueries({ queryKey: ["auth-cookie"] })
          } else {
            reject(new Error("Failed to set cookie"))
          }
          subscription.remove()
        })
      }
    })

    WebBrowser.openBrowserAsync(process.env.EXPO_PUBLIC_FOLLOW_LOGIN_URL)
  })
}

export default function AuthPage() {
  const searchParams = useLocalSearchParams()
  const ck = searchParams?.ck
  const token = useMemo(() => {
    if (typeof ck !== "string") {
      return
    }
    const cookie = atob(ck)
    const token = cookie.split("=")[1]
    return token
  }, [ck])

  if (token) {
    return <Redirect href={`/?token=${token}`} />
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      {typeof token === "string" ? (
        <Text>{token}</Text>
      ) : (
        <TouchableOpacity
          className="rounded-md p-4 text-5xl dark:bg-white"
          onPress={obtainAuthToken}
        >
          <Text className="text-placeholder-text">Sign in</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}
