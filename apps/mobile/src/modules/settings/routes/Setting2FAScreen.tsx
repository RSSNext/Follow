import type { RouteProp } from "@react-navigation/native"
import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { Text, View } from "react-native"
import type { OtpInputRef } from "react-native-otp-entry"
import { OtpInput } from "react-native-otp-entry"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import { QRCode } from "@/src/components/ui/qrcode/QRCode"
import { twoFactor } from "@/src/lib/auth"
import { queryClient } from "@/src/lib/query-client"
import { toast } from "@/src/lib/toast"
import { whoamiQueryKey } from "@/src/store/user/hooks"
import { accentColor, useColor } from "@/src/theme/colors"

import { useSettingsNavigation } from "../hooks"
import type { SettingsStackParamList } from "../types"

export const Setting2FAScreen = ({
  route,
}: {
  route: RouteProp<SettingsStackParamList, "Setting2FA">
}) => {
  const label = useColor("label")
  const tertiaryLabel = useColor("tertiaryLabel")

  const navigation = useSettingsNavigation()
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
      navigation.goBack()
      toast.success("2FA enabled!")
    },
  })
  const otpInputRef = useRef<OtpInputRef>(null)

  const isAuthCodeValid = (code: string) => {
    return code.length === 6 && Number(code) > 0
  }

  return (
    <SafeNavigationScrollView>
      <NavigationBlurEffectHeader title="Setting 2FA" />

      <View className="my-8 items-center justify-center">
        <QRCode
          data={route.params.totpURI}
          padding={20}
          pieceSize={7}
          pieceBorderRadius={4}
          isPiecesGlued
          color={label}
          preserveAspectRatio="none"
        />
      </View>

      <View className="mx-12">
        <Text className="text-secondary-label mb-8 text-sm">
          Scan the QR code above with your authenticator app, and then enter the 6-digit code which
          will be displayed in your authenticator app.
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
    </SafeNavigationScrollView>
  )
}
