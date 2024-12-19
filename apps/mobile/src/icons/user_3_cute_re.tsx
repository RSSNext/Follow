import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface User3CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const User3CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: User3CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeWidth={2}
        d="M20 18.5c0 1.933-3.582 2.5-8 2.5s-8-.567-8-2.5S7.582 14 12 14s8 2.567 8 4.5ZM16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      />
    </Svg>
  )
}
