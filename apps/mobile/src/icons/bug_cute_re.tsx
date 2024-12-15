import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface BugCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const BugCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: BugCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 13H3m18 0h-3M7 9C6 9 4.5 8 4 7m3 11c-1.5 0-2 2-2 3m12-3c1.5 0 2 2 2 3M17 9c1 0 2.5-1 3-2m-8 13.88v-8m-6 .62c0-1.688.446-3.246 1.2-4.5h9.6c.754 1.254 1.2 2.812 1.2 4.5 0 4.142-2.686 7.5-6 7.5s-6-3.358-6-7.5M8.535 6h6.93A3.998 3.998 0 0 0 12 4c-1.48 0-2.773.804-3.465 2"
      />
    </Svg>
  )
}
