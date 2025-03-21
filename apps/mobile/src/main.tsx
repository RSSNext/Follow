import "./global.css"

import { registerRootComponent } from "expo"
import { Image } from "expo-image"
import { cssInterop } from "nativewind"
import type { ReactNode } from "react"
import { useRef, useState } from "react"
import { Button, StyleSheet, Text, View } from "react-native"
import { enableFreeze, ScreenStack, ScreenStackItem } from "react-native-screens"
import { useEventCallback } from "usehooks-ts"

import { Analytics } from "./Analytics"
import { App } from "./App"
import { BottomTabProvider } from "./components/layouts/tabbar/BottomTabProvider"
import { BottomTabs } from "./components/layouts/tabbar/BottomTabs"
import { initializeApp } from "./initialize"
import { TabBarPortal } from "./lib/navigation/bottom-tab/TabBarPortal"
import { TabRoot } from "./lib/navigation/bottom-tab/TabRoot"
import { TabScreen } from "./lib/navigation/bottom-tab/TabScreen"
import { NavigationSitemapRegistry } from "./lib/navigation/sitemap/registry"
import { RootStackNavigation } from "./lib/navigation/StackNavigation"
import { RootProviders } from "./providers"
import { TermsScreen } from "./screens/(headless)/terms"
import { TwoFactorAuthScreen } from "./screens/(modal)/2fa"
import { ForgetPasswordScreen } from "./screens/(modal)/forget-password"
import { LoginScreen } from "./screens/(modal)/login"
import { SignUpScreen } from "./screens/(modal)/sign-up"
import { IndexTabScreen } from "./screens/(stack)/(tabs)"
import { DiscoverTabScreen } from "./screens/(stack)/(tabs)/discover"
import { SettingsTabScreen } from "./screens/(stack)/(tabs)/settings"
import { SubscriptionsTabScreen } from "./screens/(stack)/(tabs)/subscriptions"
import { OnboardingScreen } from "./screens/onboarding"

enableFreeze(true)
cssInterop(Image, { className: "style" })

initializeApp()

registerRootComponent(() => <Demo />)

const Demo = () => {
  const [otherRoutes, setOtherRoutes] = useState<
    {
      screenId: string
      route: ReactNode
    }[]
  >([])
  const cnt = useRef(0)
  const pushNewRoute = useEventCallback(() => {
    const screenId = `new-route-${cnt.current}`
    cnt.current++
    setOtherRoutes((prev) => [
      ...prev,
      {
        screenId,
        route: (
          <ScreenStackItem
            style={StyleSheet.absoluteFill}
            key={prev.length}
            screenId={screenId}
            onDismissed={() => {
              setOtherRoutes((prev) => prev.filter((route) => route.screenId !== screenId))
            }}
          >
            <View className="flex-1 items-center justify-center bg-white">
              <Text>New Route</Text>
            </View>
          </ScreenStackItem>
        ),
      },
    ])
  })
  return (
    <ScreenStack style={StyleSheet.absoluteFill}>
      <ScreenStackItem screenId="root" style={StyleSheet.absoluteFill}>
        <View className="flex-1 items-center justify-center bg-white">
          <Text>Root Route</Text>
          <Button title="Push New Route" onPress={pushNewRoute} />
        </View>
      </ScreenStackItem>
      {otherRoutes.map((route) => route.route)}
    </ScreenStack>
  )
}
const Entry = () => {
  return (
    <RootProviders>
      <BottomTabProvider>
        <RootStackNavigation
          headerConfig={{
            hidden: true,
          }}
        >
          <App>
            <TabRoot>
              <TabScreen title="Home">
                <IndexTabScreen />
              </TabScreen>

              <TabScreen title="Subscriptions">
                <SubscriptionsTabScreen />
              </TabScreen>

              <TabScreen title="Discover">
                <DiscoverTabScreen />
              </TabScreen>
              <TabScreen title="Settings">
                <SettingsTabScreen />
              </TabScreen>

              <TabBarPortal>
                <BottomTabs />
              </TabBarPortal>
            </TabRoot>
          </App>
          <Analytics />
        </RootStackNavigation>
      </BottomTabProvider>
    </RootProviders>
  )
}

;[TermsScreen].forEach((Component) => {
  NavigationSitemapRegistry.registerByComponent(Component)
})
;[LoginScreen, SignUpScreen, ForgetPasswordScreen, TwoFactorAuthScreen].forEach((Component) => {
  NavigationSitemapRegistry.registerByComponent(Component, void 0, {
    stackPresentation: "modal",
  })
})
;[OnboardingScreen].forEach((Component) => {
  NavigationSitemapRegistry.registerByComponent(Component, void 0, {
    stackPresentation: "transparentModal",
  })
})
