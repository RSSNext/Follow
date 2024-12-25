import { jotaiStore } from "@follow/utils"
import { ThemeProvider } from "@react-navigation/native"
import { QueryClientProvider } from "@tanstack/react-query"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { Provider } from "jotai"
import { useColorScheme } from "nativewind"
import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"

import { sqlite } from "../database"
import { queryClient } from "../lib/query-client"
import { getCurrentColors } from "../theme/colors"
import { DarkTheme, DefaultTheme } from "../theme/navigation"
import { MigrationProvider } from "./migration"

export const RootProviders = ({ children }: { children: ReactNode }) => {
  useDrizzleStudio(sqlite)
  const { colorScheme } = useColorScheme()

  const currentThemeColors = getCurrentColors()!

  return (
    <KeyboardProvider>
      <Provider store={jotaiStore}>
        <View style={[styles.flex, currentThemeColors]}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <GestureHandlerRootView>
                <MigrationProvider>{children}</MigrationProvider>
              </GestureHandlerRootView>
            </ThemeProvider>
          </QueryClientProvider>
        </View>
      </Provider>
    </KeyboardProvider>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
})
