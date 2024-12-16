import { useLocalSearchParams } from "expo-router"
import { Platform } from "react-native"
import type { WebViewProps } from "react-native-webview"
import { WebView } from "react-native-webview"

const isAndroid = Platform.OS === "android"
const presetUri = isAndroid ? "file:///android_asset/raw/index.html" : "web/index.html"
const fallbackUri = "https://app.follow.is"

export const FollowWebView = ({
  webViewRef,
  ...props
}: { webViewRef: React.RefObject<WebView> } & WebViewProps) => {
  const searchParams = useLocalSearchParams()

  // const [progress, setProgress] = useState(0)

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: presetUri ?? fallbackUri }}
      injectedJavaScriptBeforeContentLoaded={`
          document.cookie="better-auth.session_token=${searchParams.token};domain=.follow.is;path=/";
          `}
      originWhitelist={["*"]}
      allowUniversalAccessFromFileURLs
      startInLoadingState
      allowsBackForwardNavigationGestures
      /* Open chrome://inspect/#devices , or Development menu on Safari to debug the WebView. https://github.com/react-native-webview/react-native-webview/blob/master/docs/Debugging.md#debugging-webview-contents */
      webviewDebuggingEnabled
      containerStyle={{ width: "100%" }}
      // onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
      onError={(e) => {
        console.error("WebView error:", e)
      }}
      onContentProcessDidTerminate={() => webViewRef.current?.reload()}
      {...props}
    />
  )
}
