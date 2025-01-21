import { Redirect } from "expo-router"

import { Login } from "@/src/modules/login"
import { useWhoami } from "@/src/store/user/hooks"

export default function LoginPage() {
  const whoami = useWhoami()

  if (whoami?.id) {
    return <Redirect href="/" />
  }

  return <Login />
}
