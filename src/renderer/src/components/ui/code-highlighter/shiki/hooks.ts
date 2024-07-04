import { useDark } from "@renderer/hooks/common"

export const useShikiDefaultTheme = () => {
  const { isDark } = useDark()

  return isDark ? "github-dark" : "github-light"
}
