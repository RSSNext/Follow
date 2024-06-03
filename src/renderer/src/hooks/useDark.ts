import { useAtom } from "jotai"
import { atomDark } from "jotai-dark"

const isDarkAtom = atomDark({
  storageKey: "theme",
  disableTransition: true,
  applyDarkMode(isDark) {
    document.documentElement.dataset.theme = isDark ? "dark" : "light"
  },
})

export function useDark() {
  const [isDark, setIsDark] = useAtom(isDarkAtom)
  return {
    isDark,
    toggleDark: setIsDark as () => void,
    theme: (isDark ? "dark" : "light") as "dark" | "light",
  }
}
