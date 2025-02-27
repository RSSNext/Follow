import { Redirect, router } from "expo-router"
import { Text, TouchableOpacity } from "react-native"

import { Login } from "@/src/modules/login"
import { useWhoami } from "@/src/store/user/hooks"

export default function LoginPage() {
  const whoami = useWhoami()

  if (!whoami?.id) {
    // Not logged in
    return <Login />
  }
  // For development purposes, we don't want to redirect to the home page automatically
  if (__DEV__) {
    return (
      <>
        <Login />
        <TouchableOpacity
          className="bg-system-fill absolute bottom-8 left-1/2 -translate-x-1/2 flex-row items-center justify-center rounded-xl p-2 px-4"
          activeOpacity={0.7}
          onPress={() => {
            router.replace("/")
          }}
        >
          <Text className="text-secondary-label text-center font-semibold">
            Redirect to Home (DEV)
          </Text>
        </TouchableOpacity>
      </>
    )
  }

  return <Redirect href="/" />
}
