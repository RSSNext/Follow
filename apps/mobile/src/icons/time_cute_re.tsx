import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface TimeCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const TimeCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: TimeCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 7v3.757a3 3 0 0 0 .879 2.122L15 15m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
      />
    </Svg>
  )
}
