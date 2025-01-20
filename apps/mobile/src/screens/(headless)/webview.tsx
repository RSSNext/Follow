import { useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import type { WebView } from "react-native-webview"

import { BugCuteReIcon } from "@/src/icons/bug_cute_re"
import { ExitCuteReIcon } from "@/src/icons/exit_cute_re"
import { Refresh2CuteReIcon } from "@/src/icons/refresh_2_cute_re"
import { World2CuteReIcon } from "@/src/icons/world_2_cute_re"
import { signOut } from "@/src/lib/auth"

export default function Index() {
  const webViewRef = useRef<WebView>(null)
  const insets = useSafeAreaInsets()

  // const { data: token, isPending } = useAuthToken()

  // const [isCookieReady, setIsCookieReady] = useState(false)
  // useEffect(() => {
  //   if (!token) {
  //     return
  //   }

  //   // setSessionToken(token).then(() => {
  //   //   setIsCookieReady(true)
  //   // })
  // }, [token])

  // if (!token && !isPending) {
  //   return <Redirect href="/login" />
  // }

  return (
    <View className="flex-1 items-center justify-center pt-safe dark:bg-[#121212]">
      {/* {isCookieReady && <FollowWebView webViewRef={webViewRef} />} */}

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
