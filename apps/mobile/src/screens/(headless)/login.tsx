import { Redirect } from "expo-router"

import { useAuthToken } from "@/src/lib/auth"
import { Login } from "@/src/modules/login"

export default function LoginPage() {
  const { data: token } = useAuthToken()

  if (token) {
    return <Redirect href="/" />
  }

  return <Login />
}
