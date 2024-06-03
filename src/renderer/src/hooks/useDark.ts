import { useTheme } from "next-themes"

export function useIsDark() {
  const { systemTheme, theme } = useTheme()
  return systemTheme === "dark" || theme === "dark"
}
