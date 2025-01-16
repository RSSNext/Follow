import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface RoundCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const RoundCuteFiIcon = ({ width = 24, height = 24 }: RoundCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
    </Svg>
  )
}
