import { Link, router } from "expo-router"
import { useCallback } from "react"
import { Text, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import * as ContextMenu from "zeego/context-menu"

import { Logo } from "@/src/components/ui/logo"
import { TermsMarkdown } from "@/src/screens/(headless)/terms"

import { EmailLogin } from "./email"
import { SocialLogin } from "./social"

export function Login() {
  return (
    <View className="p-safe flex h-full justify-center">
      <TouchableWithoutFeedback
        onPress={() => {
          KeyboardController.dismiss()
        }}
        accessible={false}
      >
        <View className="mb-16 items-center gap-8 pt-20">
          <Logo style={{ width: 80, height: 80 }} />
          <Text className="text-label text-3xl">
            Sign in to <Text className="font-bold">Follow</Text>
          </Text>
          <EmailLogin />
        </View>
      </TouchableWithoutFeedback>
      <View className="border-t-opaque-separator border-t-hairline mx-28" />
      <View className="mb-20 mt-2 items-center">
        <View className="mb-4 flex w-full max-w-sm flex-row items-center gap-4">
          <View className="bg-separator my-4 h-[0.5px] flex-1" />
          <Text className="text-secondary-label text-lg">or</Text>
          <View className="bg-separator my-4 h-[0.5px] flex-1" />
        </View>
        <SocialLogin />
      </View>
      <TermsCheckBox />
    </View>
  )
}

const TermsCheckBox = () => {
  const shakeSharedValue = useSharedValue(0)
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeSharedValue.value }],
  }))
  return (
    <Animated.View
      className="mt-4 w-full flex-row items-center justify-center gap-2 px-8"
      style={shakeStyle}
    >
      <TermsText />
    </Animated.View>
  )
}

const TermsText = () => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="w-full overflow-hidden rounded-full">
        <Text className="text-secondary-label text-sm">
          <Link href="/terms" suppressHighlighting className="text-primary-label">
            Terms of Service
          </Link>
        </Text>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Preview
          size="STRETCH"
          onPress={useCallback(() => {
            router.push("/terms")
          }, [])}
        >
          {() => (
            <View className="bg-system-background flex-1">
              <TermsMarkdown />
            </View>
          )}
        </ContextMenu.Preview>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
