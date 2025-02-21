import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Search3CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Search3CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Search3CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M10.5 7a3.5 3.5 0 0 1 3.5 3.5m1.879 5.379 4.242 4.242M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
      />
    </Svg>
  )
}
