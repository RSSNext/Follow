import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Numbers90SortDescendingCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Numbers90SortDescendingCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Numbers90SortDescendingCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6.01c0 3-2.5 4.99-2.5 4.99M17 5v14m2.828-2c-.691 1.251-1.577 2.137-2.828 2.828-1.251-.691-2.137-1.577-2.828-2.828M8 8a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2m0 12a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2"
      />
    </Svg>
  )
}
