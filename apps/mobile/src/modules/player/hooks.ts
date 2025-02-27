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

  const isGradientLight = useMemo(() => {
    return getLuminance(backgroundColor) > 0.5
  }, [backgroundColor])

  const gradientColors = useMemo(() => {
    return [backgroundColor, shadeColor(backgroundColor, -50)] as const
  }, [backgroundColor])

  return { isGradientLight, gradientColors }
}
