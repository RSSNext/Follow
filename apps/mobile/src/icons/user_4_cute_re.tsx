import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface User4CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const User4CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: User4CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeWidth={2}
        d="M5.628 18.356C7.09 17.04 9.4 16 12 16s4.91 1.04 6.372 2.356M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-6-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </Svg>
  )
}
