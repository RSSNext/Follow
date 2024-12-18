import { parse } from "cookie-es"
import { Redirect } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import type { WebView } from "react-native-webview"

import { FollowWebView } from "@/src/components/common/FollowWebView"
import { BugCuteReIcon } from "@/src/icons/bug_cute_re"
import { ExitCuteReIcon } from "@/src/icons/exit_cute_re"
import { Refresh2CuteReIcon } from "@/src/icons/refresh_2_cute_re"
import { World2CuteReIcon } from "@/src/icons/world_2_cute_re"
import { getCookie, signOut, useSession } from "@/src/lib/auth"
import { setSessionToken } from "@/src/lib/cookie"

export default function Index() {
  const webViewRef = useRef<WebView>(null)
  const insets = useSafeAreaInsets()

  const { data: session, isPending } = useSession()

  const [isCookieReady, setIsCookieReady] = useState(false)
  useEffect(() => {
    if (!session) {
      return
    }

    const cookie = getCookie()
    const token = parse(cookie)["better-auth.session_token"]

    setSessionToken(token).then(() => {
      setIsCookieReady(true)
    })
  }, [session])

  if (!session && !isPending) {
    return <Redirect href="/login" />
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isCookieReady && <FollowWebView webViewRef={webViewRef} />}

      {__DEV__ && (
        <View
          style={{ paddingBottom: Math.max(insets.bottom - 12, 0), paddingHorizontal: 12 }}
          className="absolute bottom-0 right-0 flex flex-row items-center gap-2"
        >
          <TouchableOpacity
            onPress={() => {
              webViewRef.current?.injectJavaScript(
                `window.location.href = "https://app.follow.is";`,
              )
            }}
          >
            <World2CuteReIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              webViewRef.current?.injectJavaScript(
                `window.location.href = "http://localhost:2233/";`,
              )
            }}
          >
            <BugCuteReIcon />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
            <Refresh2CuteReIcon />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              signOut()
            }}
          >
            <ExitCuteReIcon />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
