import { useInsertionEffect } from "react"
import { useDarkMode } from "usehooks-ts"

import { colorVariants, palette } from "./colors"

export const useCSSInjection = () => {
  const isDark = useDarkMode().isDarkMode

  useInsertionEffect(() => {
    const style = document.createElement("style")

    const vars1 = colorVariants[isDark ? "dark" : "light"]
    const vars2 = palette[isDark ? "dark" : "light"]

    style.innerHTML = `:root {${[...Object.entries(vars1), ...Object.entries(vars2)]
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n")}}`

    document.head.append(style)
    return () => {
      style.remove()
    }
  }, [isDark])
}
