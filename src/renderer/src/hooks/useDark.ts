import { useAtom } from "jotai"
import { atomDark } from "jotai-dark"

const isDarkAtom = atomDark({
  disableTransition: true,
  disableTransitionExclude: [".i-mingcute-sun-line", ".i-mingcute-moon-line"],
})

export function useDark() {
  const [isDark, setIsDark] = useAtom(isDarkAtom)
  return {
    isDark,
    toggleDark: setIsDark as () => void,
    theme: (isDark ? "dark" : "light") as "dark" | "light",
  }
}
