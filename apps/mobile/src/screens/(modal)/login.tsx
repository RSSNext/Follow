import { useEffect } from "react"
import { Text, TouchableOpacity } from "react-native"

import { HeaderCloseOnly } from "@/src/components/layouts/header/HeaderElements"
import { Navigation } from "@/src/lib/navigation/Navigation"
import type { NavigationControllerView } from "@/src/lib/navigation/types"
import { Login } from "@/src/modules/login"
import { useWhoami } from "@/src/store/user/hooks"

function exit() {
  const router = Navigation.rootNavigation
  if (router.canGoBack()) {
    router.back()
  } else {
    router.popToRoot()
  }
}

export const LoginScreen: NavigationControllerView = () => {
  const whoami = useWhoami()

  useEffect(() => {
    if (whoami?.id && !__DEV__) {
      exit()
    }
  }, [whoami])

  // For development purposes, we don't want to redirect to the home page automatically
  return (
    <>
      <Login />
      <HeaderCloseOnly />
      {!!whoami?.id && __DEV__ && (
        <TouchableOpacity
          className="bg-system-fill absolute bottom-8 left-1/2 -translate-x-1/2 flex-row items-center justify-center rounded-xl p-2 px-4"
          activeOpacity={0.7}
          onPress={() => {
            exit()
          }}
        >
          <Text className="text-secondary-label text-center font-semibold">
            Redirect to Home (DEV)
          </Text>
        </TouchableOpacity>
      )}
    </>
  )
}
