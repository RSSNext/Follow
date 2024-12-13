import * as Linking from "expo-linking"
import { useLocalSearchParams } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import { useMemo } from "react"
import { Button, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

function obtainAuthToken() {
  return new Promise<string>((resolve) => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const { hostname, queryParams } = Linking.parse(url)
      if (hostname === "auth" && queryParams !== null && typeof queryParams.ck === "string") {
        WebBrowser.dismissBrowser()
        const { ck } = queryParams
        resolve(ck)
        subscription.remove()
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {typeof token === "string" ? (
        <Text>{token}</Text>
      ) : (
        <Button title="Sign in" onPress={obtainAuthToken} />
      )}
    </SafeAreaView>
  )
}
