import { ThemeProvider } from "@react-navigation/native"
import { QueryClientProvider } from "@tanstack/react-query"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { useColorScheme } from "nativewind"
import type { ReactNode } from "react"
import { View } from "react-native"
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
      <View style={[{ flex: 1 }, currentThemeColors]}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <MigrationProvider>{children}</MigrationProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </View>
    </KeyboardProvider>
  )
}
