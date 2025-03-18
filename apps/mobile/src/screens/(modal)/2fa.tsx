import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { Text, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"
import type { OtpInputRef } from "react-native-otp-entry"
import { OtpInput } from "react-native-otp-entry"
import { useColor } from "react-native-uikit-colors"

import { HeaderCloseOnly } from "@/src/components/layouts/header/HeaderElements"
import { twoFactor } from "@/src/lib/auth"
import { useNavigation } from "@/src/lib/navigation/hooks"
import type { NavigationControllerView } from "@/src/lib/navigation/types"
import { queryClient } from "@/src/lib/query-client"
import { toast } from "@/src/lib/toast"
import { whoamiQueryKey } from "@/src/store/user/hooks"
import { accentColor } from "@/src/theme/colors"

function isAuthCodeValid(authCode: string) {
  return (
    authCode.length === 6 && !Array.from(authCode).some((c) => Number.isNaN(Number.parseInt(c)))
  )
}

export const TwoFactorAuthScreen: NavigationControllerView = () => {
  const label = useColor("label")
  const tertiaryLabel = useColor("tertiaryLabel")

  const otpInputRef = useRef<OtpInputRef>(null)

  const navigation = useNavigation()

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
    },
    onSuccess() {
      navigation.popToRoot()
    },
  })

  return (
    <View className="p-safe flex-1">
      <HeaderCloseOnly />
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
              placeholderTextStyle: { color: tertiaryLabel },
              filledPinCodeContainerStyle: { borderColor: label },
              pinCodeContainerStyle: {
                borderColor: tertiaryLabel,
                aspectRatio: 1,
                width: 50,
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
  )
}
