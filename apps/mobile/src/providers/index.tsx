import { ActionSheetProvider } from "@expo/react-native-action-sheet"
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
import { RootSiblingParent } from "react-native-root-siblings"
import { SheetProvider } from "react-native-sheet-transitions"

import { PreviewImageProvider } from "../components/ui/image/PreviewPageProvider"
import { PortalHost } from "../components/ui/portal"
import { sqlite } from "../database"
import { queryClient } from "../lib/query-client"
import { DarkTheme, DefaultTheme } from "../theme/navigation"
import { getCurrentColors } from "../theme/utils"
import { MigrationProvider } from "./migration"

export const RootProviders = ({ children }: { children: ReactNode }) => {
  useDrizzleStudio(sqlite)
  const { colorScheme } = useColorScheme()

  const currentThemeColors = getCurrentColors()!

  return (
    <MigrationProvider>
      <Provider store={jotaiStore}>
        <KeyboardProvider>
          <View style={[styles.flex, currentThemeColors]}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <GestureHandlerRootView>
                  <SheetProvider>
                    <ActionSheetProvider>
                      <PreviewImageProvider>
                        <RootSiblingParent>
                          <PortalHost>{children}</PortalHost>
                        </RootSiblingParent>
                      </PreviewImageProvider>
                    </ActionSheetProvider>
                  </SheetProvider>
                </GestureHandlerRootView>
              </ThemeProvider>
            </QueryClientProvider>
          </View>
        </KeyboardProvider>
      </Provider>
    </MigrationProvider>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
})
