import { useMutation } from "@tanstack/react-query"
import { router } from "expo-router"
import { useMemo, useRef } from "react"
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useAnimatedValue,
  View,
} from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"
import type { OtpInputRef } from "react-native-otp-entry"
import { OtpInput } from "react-native-otp-entry"
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
import { accentColor } from "@/src/theme/colors"

function isAuthCodeValid(authCode: string) {
  return (
    authCode.length === 6 && !Array.from(authCode).some((c) => Number.isNaN(Number.parseInt(c)))
  )
}

export default function TwoFactorAuthScreen() {
  const scrollY = useAnimatedValue(0)
  const label = useColor("label")
  const secondaryLabel = useColor("secondaryLabel")

  const otpInputRef = useRef<OtpInputRef>(null)

  const submitMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await twoFactor.verifyTotp({ code: value })
      if (res.error) {
        throw new Error(res.error.message)
      }
      await queryClient.invalidateQueries({ queryKey: whoamiQueryKey })
    },
    onError(error) {
      otpInputRef.current?.clear()
      toast.error(`Failed to verify: ${error.message}`)
    },
    onSuccess() {
      router.replace("/")
    },
  })

  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      <View className="flex-1 p-safe">
        <NavigationBlurEffectHeader
          headerShown
          headerTitle=""
          title="2FA"
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
            <View className="mb-10 flex-row items-center justify-center">
              <Text className="text-label w-72 text-center text-3xl font-bold" numberOfLines={2}>
                Verify with your authenticator app
              </Text>
            </View>

            <OtpInput
              disabled={submitMutation.isPending}
              ref={otpInputRef}
              numberOfDigits={6}
              autoFocus
              focusColor={accentColor}
              theme={{
                containerStyle: { paddingHorizontal: 20 },
                pinCodeTextStyle: { color: label },
                placeholderTextStyle: { color: secondaryLabel },
                filledPinCodeContainerStyle: { borderColor: label },
                pinCodeContainerStyle: {
                  borderColor: secondaryLabel,
                },
                focusedPinCodeContainerStyle: { borderColor: accentColor },
              }}
              onFilled={(code) => {
                if (isAuthCodeValid(code)) {
                  submitMutation.mutate(code)
                }
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </NavigationContext.Provider>
  )
}
