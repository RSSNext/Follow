import { Redirect } from "expo-router"

import { Login } from "@/src/modules/login"
import { useWhoami } from "@/src/store/user/hooks"

export default function LoginPage() {
  const whoami = useWhoami()

  if (whoami?.id && !__DEV__) {
    return <Redirect href="/" />
  }

  return <Login />
}
