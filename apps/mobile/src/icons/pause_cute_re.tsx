import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface PauseCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const PauseCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: PauseCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path stroke={color} strokeLinecap="round" strokeWidth={2} d="M8 5v14m8-14v14" />
    </Svg>
  )
}
