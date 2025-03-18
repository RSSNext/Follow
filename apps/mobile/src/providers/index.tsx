import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { jotaiStore } from "@follow/utils"
import { PortalProvider } from "@gorhom/portal"
import { QueryClientProvider } from "@tanstack/react-query"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { Provider } from "jotai"
import { useColorScheme } from "nativewind"
import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { RootSiblingParent } from "react-native-root-siblings"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SheetProvider } from "react-native-sheet-transitions"

import { ErrorBoundary } from "../components/common/ErrorBoundary"
import { BottomTabProvider } from "../components/layouts/tabbar/BottomTabProvider"
import { sqlite } from "../database"
import { queryClient } from "../lib/query-client"
import { getCurrentColors } from "../theme/utils"
import { MigrationProvider } from "./migration"

export const RootProviders = ({ children }: { children: ReactNode }) => {
  useDrizzleStudio(sqlite)

  const currentThemeColors = getCurrentColors()!

  return (
    <SafeAreaProvider>
      <MigrationProvider>
        <Provider store={jotaiStore}>
          <ErrorBoundary>
            <KeyboardProvider>
              <View style={[styles.flex, currentThemeColors]}>
                <QueryClientProvider client={queryClient}>
                  <GestureHandlerRootView>
                    <SheetProvider>
                      <ActionSheetProvider>
                        <RootSiblingParent>
                          <PortalProvider>{children}</PortalProvider>
                        </RootSiblingParent>
                      </ActionSheetProvider>
                    </SheetProvider>
                  </GestureHandlerRootView>
                </QueryClientProvider>
              </View>
            </KeyboardProvider>
          </ErrorBoundary>
        </Provider>
      </MigrationProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
})
