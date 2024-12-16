import { Redirect, useLocalSearchParams } from "expo-router"
import { useRef } from "react"
import { Button, View } from "react-native"
import type { WebView } from "react-native-webview"

import { FollowWebView } from "@/src/components/common/FollowWebView"

export default function Index() {
  const webViewRef = useRef<WebView>(null)
  const searchParams = useLocalSearchParams()

  if (!searchParams?.token) {
    return <Redirect href="/auth" />
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FollowWebView webViewRef={webViewRef} />
      <Button title="Reload" onPress={() => webViewRef.current?.reload()} />
    </View>
  )
}
