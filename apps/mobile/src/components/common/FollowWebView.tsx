import { Platform } from "react-native"
import type { WebViewProps } from "react-native-webview"
import { WebView } from "react-native-webview"

const presetUri = Platform.select({
  ios: "web/index.html",
  android: "file:///android_asset/raw/index.html",
  default: "https://app.follow.is",
})

interface FollowWebViewProps extends WebViewProps {
  customUrl?: string
}

export const FollowWebView = ({
  webViewRef,
  customUrl,
  ...props
}: { webViewRef: React.RefObject<WebView> } & FollowWebViewProps) => {
  return (
    <WebView
      ref={webViewRef}
      source={{ uri: customUrl ?? presetUri }}
      injectedJavaScriptBeforeContentLoaded="window.__RN__ = true;"
      sharedCookiesEnabled
      originWhitelist={["*"]}
      allowUniversalAccessFromFileURLs
      startInLoadingState
      allowsBackForwardNavigationGestures
      /* Open chrome://inspect/#devices , or Development menu on Safari to debug the WebView. https://github.com/react-native-webview/react-native-webview/blob/master/docs/Debugging.md#debugging-webview-contents */
      webviewDebuggingEnabled={__DEV__}
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
