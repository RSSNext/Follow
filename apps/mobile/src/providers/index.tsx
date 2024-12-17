import { ThemeProvider } from "@react-navigation/native"
import { QueryClientProvider } from "@tanstack/react-query"
import { useColorScheme } from "nativewind"
import type { ReactNode } from "react"

import { queryClient } from "../lib/query-client"
import { DarkTheme, DefaultTheme } from "../theme/navigation"

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const { colorScheme } = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
