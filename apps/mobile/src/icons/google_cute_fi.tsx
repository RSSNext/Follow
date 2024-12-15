import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface GoogleCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const GoogleCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: GoogleCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M17.641 6.328a8 8 0 1 0 2.297 6.67C20.007 12.45 19.552 12 19 12h-6"
      />
    </Svg>
  )
}
