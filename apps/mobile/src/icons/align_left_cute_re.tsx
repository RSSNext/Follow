import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface AlignLeftCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const AlignLeftCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: AlignLeftCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M4 4h16M4 9h10M4 14h16M4 19h10"
      />
    </Svg>
  )
}
