import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface LineCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const LineCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: LineCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path stroke={color} strokeLinecap="round" strokeWidth={2} d="M4 20 20 4" />
    </Svg>
  )
}
