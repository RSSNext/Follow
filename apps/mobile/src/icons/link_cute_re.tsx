import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface LinkCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const LinkCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: LinkCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="m11.647 5.988-1.415-1.414a4 4 0 0 0-5.656 0v0a4 4 0 0 0 0 5.656l2.828 2.829a4 4 0 0 0 5.657 0m-.707 4.95 1.414 1.414a4 4 0 0 0 5.657 0v0a4 4 0 0 0 0-5.657l-2.829-2.828a4 4 0 0 0-5.656 0"
      />
    </Svg>
  )
}
