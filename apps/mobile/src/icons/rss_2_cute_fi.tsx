import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Rss2CuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const Rss2CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Rss2CuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M5.5 6.5c-.15 0-.298.003-.445.008a1.5 1.5 0 1 1-.11-2.998c.185-.007.37-.01.555-.01 8.284 0 15 6.716 15 15 0 .186-.003.37-.01.555a1.5 1.5 0 1 1-2.998-.11c.005-.147.008-.296.008-.445 0-6.627-5.373-12-12-12m0 7c-.13 0-.259.005-.386.015a1.5 1.5 0 1 1-.228-2.992 8 8 0 0 1 8.59 8.59 1.5 1.5 0 0 1-2.99-.227A5 5 0 0 0 5.5 13.5m-2 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
        clipRule="evenodd"
      />
    </Svg>
  )
}
