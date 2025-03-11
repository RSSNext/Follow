import { getLuminance, shadeColor } from "@follow/utils"
import { useMemo } from "react"

import { useImageColors } from "@/src/store/image/hooks"

const defaultBackgroundColor = "#000000"

export function useCoverGradient(url?: string) {
  const imageColors = useImageColors(url)

  const backgroundColor = useMemo(() => {
    if (imageColors?.platform === "ios") {
      return imageColors.background
    } else if (imageColors?.platform === "android") {
      return imageColors.average
    }
    return defaultBackgroundColor
  }, [imageColors])

  const gradientColors = useMemo(() => {
    const shadedColor = shadeColor(backgroundColor, -50)
    return [shadedColor, shadedColor] as const
  }, [backgroundColor])

  const isGradientLight = useMemo(() => {
    return getLuminance(gradientColors[0]) > 0.5
  }, [gradientColors])

  return { isGradientLight, gradientColors }
}
