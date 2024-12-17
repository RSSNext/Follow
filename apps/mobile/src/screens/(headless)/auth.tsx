// NOTE: use better-auth expo
import { useMutation } from "@tanstack/react-query"
import * as Linking from "expo-linking"
import { useRouter } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import { Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { storage } from "@/src/lib/storage"

function obtainAuthToken() {
  return new Promise<string>((resolve) => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const { hostname, queryParams } = Linking.parse(url)
      if (hostname === "auth" && queryParams !== null && typeof queryParams.ck === "string") {
        WebBrowser.dismissBrowser()
        const { ck } = queryParams

        const cookie = atob(ck)
        const token = cookie.split("=")[1]
        storage.set("auth.token", token)
        subscription.remove()
        resolve(token)
      }
    })

    WebBrowser.openBrowserAsync(process.env.EXPO_PUBLIC_FOLLOW_LOGIN_URL)
  })
}

export default function AuthPage() {
  const router = useRouter()
  const obtainAuthTokenMutation = useMutation({
    mutationFn: obtainAuthToken,
    onSuccess: () => {
      router.replace("/")
    },
  })

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <TouchableOpacity
        className="rounded-md p-4 text-5xl dark:bg-white"
        onPress={() => {
          obtainAuthTokenMutation.mutate()
        }}
      >
        <Text className="text-placeholder-text">Sign in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
