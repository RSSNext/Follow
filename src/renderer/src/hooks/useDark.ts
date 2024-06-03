import { useAtom } from "jotai"
import { atomDark } from "jotai-dark"

const isDarkAtom = atomDark({
  storageKey: "theme",
  applyDarkMode(isDark) {
    const $css = document.createElement("style")
    $css.innerHTML = `* {
      transition: none !important;
    }`
    document.head.append($css)

    void document.body.offsetHeight

    document.documentElement.dataset.theme = isDark ? "dark" : "light"

    void document.body.offsetHeight
    $css.remove()
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
