import { callWebviewExpose } from "@follow/shared"
import { parseSafeUrl, transformVideoUrl } from "@follow/utils"
import * as Linking from "expo-linking"
import type { RefObject } from "react"
import { useCallback, useEffect, useState } from "react"
import { Platform } from "react-native"
import type { WebViewNavigation, WebViewProps } from "react-native-webview"
import { WebView } from "react-native-webview"

import { signOut } from "@/src/lib/auth"
import { useOpenLink } from "@/src/lib/hooks/use-open-link"

const presetUri = Platform.select({
  ios: "rn-web/index.html",
  android: "file:///android_asset/raw/index.html",
  default: "https://app.follow.is",
})

const allowHosts = new Set(["app.follow.is"])

interface FollowWebViewProps extends WebViewProps {
  customUrl?: string
}

const injectedJavaScript = [
  `window.__RN__ = true`,
  // TODO use more reliable way to detect the page is ready
  `window.setTimeout(() => window.ReactNativeWebView.postMessage("ready"), 2000)`,
].join(";")

const styles = {
  // https://github.com/react-native-webview/react-native-webview/issues/318#issuecomment-503979211
  webview: { backgroundColor: "transparent" },
  webviewContainer: { width: "100%" },
} as const

export const FollowWebView = ({
  webViewRef,
  customUrl,
  ...props
}: { webViewRef: RefObject<WebView> } & FollowWebViewProps) => {
  const { onNavigationStateChange } = useWebViewNavigation({ webViewRef })
  const [ready, setReady] = useState(false)
  useDeepLink({ webViewRef, ready })

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: customUrl ?? presetUri }}
      injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
      sharedCookiesEnabled
      originWhitelist={["*"]}
      allowUniversalAccessFromFileURLs
      startInLoadingState
      allowsBackForwardNavigationGestures
      /* Open chrome://inspect/#devices , or Development menu on Safari to debug the WebView. https://github.com/react-native-webview/react-native-webview/blob/master/docs/Debugging.md#debugging-webview-contents */
      webviewDebuggingEnabled={__DEV__}
      style={styles.webview}
      containerStyle={styles.webviewContainer}
      onNavigationStateChange={onNavigationStateChange}
      // onLoad={() => setReady(false)}
      // onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
      onError={(e) => {
        console.error("WebView error:", e)
      }}
      onContentProcessDidTerminate={() => webViewRef.current?.reload()}
      onMessage={(e) => {
        const message = e.nativeEvent.data
        if (message === "sign-out") {
          signOut()
          return
        }
        if (message === "ready") {
          setReady(true)
          return
        }
      }}
      {...props}
    />
  )
}

const useWebViewNavigation = ({ webViewRef }: { webViewRef: RefObject<WebView> }) => {
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

  return { onNavigationStateChange }
}

// We only need to handle deep link at the first time the app is opened
let lastInitialUrl: string | null = null
const useDeepLink = ({
  webViewRef,
  ready = true,
}: {
  webViewRef: RefObject<WebView>
  ready?: boolean
}) => {
  const handleDeepLink = useCallback(
    async (url: string) => {
      const { queryParams, path, hostname } = Linking.parse(url)

      const pathname = (hostname || "") + (path || "")
      const pathnameTrimmed = pathname?.endsWith("/") ? pathname.slice(0, -1) : pathname

      switch (pathnameTrimmed) {
        case "/add":
        case "/follow": {
          if (!queryParams) {
            console.error("Invalid URL! queryParams is not available", url)
            return
          }

          const id = queryParams["id"] ?? undefined
          const isList = queryParams["type"] === "list"
          // const urlParam = queryParams["url"] ?? undefined
          if (!id || typeof id !== "string") {
            console.error("Invalid URL! id is not a string", url)
            return
          }
          const injectJavaScript = webViewRef.current?.injectJavaScript
          if (!injectJavaScript) {
            console.error("injectJavaScript is not available")
            return
          }
          callWebviewExpose(injectJavaScript).follow({ id, isList })
          return
        }
      }
    },
    [webViewRef],
  )

  // https://reactnative.dev/docs/linking#handling-deep-links
  //
  // The handler added with Linking.addEventListener() is only triggered when app is already open.
  //
  // When the app is not already open and the deep link triggered app launch,
  // the URL can be obtained with Linking.getInitialURL().
  useEffect(() => {
    if (!ready) return

    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL()
      if (!initialUrl) return
      if (initialUrl === lastInitialUrl) return
      lastInitialUrl = initialUrl
      handleDeepLink(initialUrl)
    }
    getUrlAsync()
    // eslint-disable-next-line @eslint-react/web-api/no-leaked-event-listener
    const deepLinkListener = Linking.addEventListener("url", (event: { url: string }) => {
      handleDeepLink(event.url)
    })
    return () => deepLinkListener.remove()
  }, [handleDeepLink, ready])
}
