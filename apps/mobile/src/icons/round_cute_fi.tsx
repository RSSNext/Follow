import * as React from "react"
import Svg, { Circle } from "react-native-svg"

interface RoundCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const RoundCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: RoundCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} fill={color} />
    </Svg>
  )
}
