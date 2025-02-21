import { useMutation } from "@tanstack/react-query"
import { router } from "expo-router"
import { useMemo, useState } from "react"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useAnimatedValue,
  View,
} from "react-native"
import { KeyboardAvoidingView, KeyboardController } from "react-native-keyboard-controller"
import { useColor } from "react-native-uikit-colors"

import {
  NavigationBlurEffectHeader,
  NavigationContext,
} from "@/src/components/common/SafeNavigationScrollView"
import { MingcuteLeftLineIcon } from "@/src/icons/mingcute_left_line"
import { twoFactor } from "@/src/lib/auth"
import { queryClient } from "@/src/lib/query-client"
import { toast } from "@/src/lib/toast"
import { whoamiQueryKey } from "@/src/store/user/hooks"

function isAuthCodeValid(authCode: string) {
  return (
    authCode.length === 6 && !Array.from(authCode).some((c) => Number.isNaN(Number.parseInt(c)))
  )
}

export default function TwoFactorAuthScreen() {
  const scrollY = useAnimatedValue(0)
  const label = useColor("label")
  const [authCode, setAuthCode] = useState("")

  const submitMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await twoFactor.verifyTotp({ code: value })
      if (res.error) {
        throw new Error(res.error.message)
      }
      await queryClient.invalidateQueries({ queryKey: whoamiQueryKey })
    },
    onError(error) {
      toast.error(`Failed to verify: ${error.message}`)
      setAuthCode("")
    },
    onSuccess() {
      router.replace("/")
    },
  })

  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      <View className="flex-1 p-safe">
        <KeyboardAvoidingView behavior={"padding"} className="flex-1">
          <NavigationBlurEffectHeader
            headerShown
            headerTitle=""
            headerLeft={() => {
              return (
                <TouchableOpacity onPress={() => router.back()}>
                  <MingcuteLeftLineIcon color={label} />
                </TouchableOpacity>
              )
            }}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              KeyboardController.dismiss()
            }}
            accessible={false}
          >
            <View className="mt-20 flex-1 pb-10">
              <View className="flex-row items-center justify-center">
                <Text className="text-label w-72 text-center text-3xl font-bold" numberOfLines={2}>
                  Verify with your authenticator app
                </Text>
              </View>

              <View className="mx-5 mt-10">
                <Text className="text-label">Enter Follow Auth Code</Text>
                <View className="bg-secondary-system-background mt-2 rounded-lg p-4">
                  <TextInput
                    placeholder="6-digit authentication code"
                    autoComplete="one-time-code"
                    keyboardType="numeric"
                    className="text-text"
                    value={authCode}
                    onChangeText={setAuthCode}
                  />
                </View>
              </View>

              <View className="flex-1" />

              <TouchableOpacity
                className="disabled:bg-gray-3 mx-5 rounded-lg bg-accent py-3"
                disabled={submitMutation.isPending || !isAuthCodeValid(authCode)}
                onPress={() => {
                  submitMutation.mutate(authCode)
                }}
              >
                {submitMutation.isPending ? (
                  <ActivityIndicator className="text-white" />
                ) : (
                  <Text className="text-center font-semibold text-white">Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </NavigationContext.Provider>
  )
}
