import { SafeAreaView } from "react-native-safe-area-context"

import { ThemedText } from "@/src/components/common/ThemedText"
import { Logo } from "@/src/components/ui/logo"

import { EmailLogin } from "./email"
import { SocialLogin } from "./social"

export function Login() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-10">
      <Logo style={{ width: 100, height: 100 }} />
      <ThemedText className="text-2xl font-bold">Login to Follow</ThemedText>
      <EmailLogin />
      <SocialLogin />
    </SafeAreaView>
  )
}
