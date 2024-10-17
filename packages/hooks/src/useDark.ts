import { useAtomValue } from "jotai"

import { themeAtom, useDarkQuery } from "./internal/for-theme"

function useDarkWebApp() {
  const systemIsDark = useDarkQuery()
  const mode = useAtomValue(themeAtom)
  return mode === "dark" || (mode === "system" && systemIsDark)
}
/**
 * Only for web app
 */
export const useIsDark = useDarkWebApp

export const useThemeAtomValue = () => useAtomValue(themeAtom)
