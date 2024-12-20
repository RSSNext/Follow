import { parseSafeUrl, transformVideoUrl } from "@follow/utils"
import type { RefObject } from "react"
import { useCallback } from "react"
import { Platform } from "react-native"
import type { WebViewNavigation, WebViewProps } from "react-native-webview"
import { WebView } from "react-native-webview"

import { signOut } from "@/src/lib/auth"
import { useOpenLink } from "@/src/lib/hooks/useOpenLink"

const presetUri = Platform.select({
  ios: "rn-web/index.html",
  android: "file:///android_asset/raw/index.html",
  default: "https://app.follow.is",
})

const allowHosts = new Set(["app.follow.is"])

interface FollowWebViewProps extends WebViewProps {
  customUrl?: string
}

export const FollowWebView = ({
  webViewRef,
  customUrl,
  ...props
}: { webViewRef: RefObject<WebView> } & FollowWebViewProps) => {
  const openLink = useOpenLink()
  const onNavigationStateChange = useCallback(
    (newNavState: WebViewNavigation) => {
      const { url: urlStr } = newNavState
      const url = parseSafeUrl(urlStr)
      if (!url) return
      if (url.protocol === "file:") return
      if (allowHosts.has(url.host)) return

      webViewRef.current?.stopLoading()

      const formattedUrl = transformVideoUrl({ url: urlStr })
      if (formattedUrl) {
        openLink(formattedUrl)
        return
      }
      openLink(urlStr)
    },
    [openLink, webViewRef],
  )

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
      onNavigationStateChange={onNavigationStateChange}
      // onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
      onError={(e) => {
        console.error("WebView error:", e)
      }}
      onContentProcessDidTerminate={() => webViewRef.current?.reload()}
      onMessage={(e) => {
        const message = e.nativeEvent.data
        if (message === "sign-out") {
          signOut()
        }
      }}
      {...props}
    />
  )
}
