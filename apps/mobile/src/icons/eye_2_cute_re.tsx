import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Eye2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Eye2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Eye2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeWidth={2}
        d="M21 12c0 3-4.03 6.5-9 6.5S3 15 3 12s4.03-6.5 9-6.5S21 9 21 12Z"
      />
      <Path stroke={color} strokeWidth={2} d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </Svg>
  )
}
