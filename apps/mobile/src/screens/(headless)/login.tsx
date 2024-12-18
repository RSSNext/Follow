import { Redirect } from "expo-router"
import { useState } from "react"
import { Button, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { signIn, useAuthToken } from "@/src/lib/auth"

export default function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { data: token } = useAuthToken()

  const handleLogin = async () => {
    await signIn.email({
      email,
      password,
    })
  }

  if (token) {
    return <Redirect href="/" />
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </SafeAreaView>
  )
}
