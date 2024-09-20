import { useIsDark } from "~/hooks/common"

export const useShikiDefaultTheme = () => {
  const isDark = useIsDark()

  return isDark ? "github-dark" : "github-light"
}
