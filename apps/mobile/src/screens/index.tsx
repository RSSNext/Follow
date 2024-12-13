import { Redirect, useLocalSearchParams } from "expo-router"
import { useRef } from "react"
import { View } from "react-native"
import { WebView } from "react-native-webview"

export default function Index() {
  const webViewRef = useRef<WebView>()
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
      <WebView
        source={{ uri: "https://app.follow.is" }}
        injectedJavaScriptBeforeContentLoaded={`
          document.cookie="better-auth.session_token=${searchParams.token};domain=.follow.is;path=/"`}
        onContentProcessDidTerminate={() => webViewRef.current?.reload()}
        startInLoadingState={true}
        style={{ flex: 1 }}
        containerStyle={{ width: "100%" }}
      />
    </View>
  )
}
