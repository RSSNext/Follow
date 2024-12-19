import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller"

import { ThemedText } from "@/src/components/common/ThemedText"
import { Logo } from "@/src/components/ui/logo"

import { EmailLogin } from "./email"
import { SocialLogin } from "./social"

export function Login() {
  return (
    <>
      <KeyboardAwareScrollView contentContainerClassName="flex-1 items-center justify-center gap-10">
        <Logo style={{ width: 100, height: 100 }} />
        <ThemedText className="text-2xl font-bold">Login to Follow</ThemedText>
        <EmailLogin />
        <SocialLogin />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  )
}
