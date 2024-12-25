import { TouchableWithoutFeedback, View } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"

import { ThemedText } from "@/src/components/common/ThemedText"
import { Logo } from "@/src/components/ui/logo"

import { EmailLogin } from "./email"
import { SocialLogin } from "./social"

export function Login() {
  return (
    <View className="flex-1 gap-10 p-safe">
      <TouchableWithoutFeedback
        onPress={() => {
          KeyboardController.dismiss()
        }}
        accessible={false}
      >
        <View className="flex-1 items-center gap-10 pt-20">
          <Logo style={{ width: 100, height: 100 }} />
          <ThemedText className="text-2xl font-bold">Login to Follow</ThemedText>
          <EmailLogin />
        </View>
      </TouchableWithoutFeedback>
      <View className="items-center">
        <View className="mb-4 flex w-full max-w-sm flex-row items-center gap-4">
          <View className="bg-separator my-4 h-[0.5px] flex-1" />
          <ThemedText className="text-xl">or</ThemedText>
          <View className="bg-separator my-4 h-[0.5px] flex-1" />
        </View>
        <SocialLogin />
      </View>
    </View>
  )
}
