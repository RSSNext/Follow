import { useMutation } from "@tanstack/react-query"
import { router } from "expo-router"
import { useState } from "react"
import { Text, TextInput, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardAvoidingView, KeyboardController } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { SubmitButton } from "@/src/components/common/SubmitButton"
import { forgetPassword } from "@/src/lib/auth"
import { toast } from "@/src/lib/toast"

export default function ForgetPassword() {
  const offset = useSafeAreaInsets()
  const [email, setEmail] = useState("")

  const forgetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await forgetPassword({ email })
      if (res.error) {
        throw new Error(res.error.message)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("We have sent you an email with instructions to reset your password.")
      router.back()
    },
  })

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        KeyboardController.dismiss()
      }}
      accessible={false}
    >
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View className="p-safe px-safe-offset-4 flex-1 justify-between">
          <View className="items-center">
            <Text className="text-text text-4xl font-bold">Forgotten password?</Text>
            <Text className="text-text mx-10 mt-6 text-lg">
              Enter your email address that you use with your account to continue.
            </Text>

            <View className="bg-secondary-system-background mt-6 gap-4 self-stretch rounded-2xl px-6 py-4">
              <View className="flex-row">
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoComplete="email"
                  placeholder="Email"
                  className="text-text flex-1"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={() => forgetPasswordMutation.mutate(email)}
                />
              </View>
            </View>
          </View>

          <SubmitButton
            title="Continue"
            className="self-stretch"
            style={{
              bottom: offset.bottom + 30,
            }}
            disabled={!email || forgetPasswordMutation.isPending}
            isLoading={forgetPasswordMutation.isPending}
            onPress={() => forgetPasswordMutation.mutate(email)}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
