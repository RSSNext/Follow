import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Download2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Download2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Download2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v12m-4.242-3.586c.83 1.915 2.023 3.18 3.848 4.062.249.12.54.12.789 0 1.824-.882 3.017-2.147 3.848-4.062M4.002 16c.012 2.175.109 3.353.877 4.121C5.758 21 7.172 21 10 21h4c2.829 0 4.243 0 5.122-.879.768-.768.864-1.946.877-4.121"
      />
    </Svg>
  )
}
