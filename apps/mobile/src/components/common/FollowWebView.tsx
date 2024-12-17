/* eslint-disable unicorn/no-document-cookie */
import { useLocalSearchParams } from "expo-router"
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

const injectedJavaScript = function injectedJavaScript(token: string) {
  "show source"

  document.cookie = `better-auth.session_token=${token};domain=.follow.is;path=/`
  // @ts-expect-error
  window.__RN__ = true
}

export const FollowWebView = ({
  webViewRef,
  customUrl,
  ...props
}: { webViewRef: React.RefObject<WebView> } & FollowWebViewProps) => {
  const searchParams = useLocalSearchParams()

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: customUrl ?? presetUri }}
      injectedJavaScriptBeforeContentLoaded={
        !customUrl
          ? `${injectedJavaScript.toString()};injectedJavaScript(${searchParams.token})`
          : ""
      }
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
