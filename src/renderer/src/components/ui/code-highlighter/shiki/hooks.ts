import { useDark } from "@renderer/hooks"

export const useShikiDefaultTheme = () => {
  const { isDark } = useDark()

  return isDark ? "github-dark" : "github-light"
}
