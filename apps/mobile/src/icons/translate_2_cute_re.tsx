import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Translate2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Translate2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Translate2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 20c.9-3.068 2.116-6.272 3.689-9.118a.92.92 0 0 1 1.622 0C17.884 13.728 19.1 16.932 20 20m-7.65-3h6.3M4 6h5m0 0h3M9 6V4m3 2h2m-2 0c0 2.39-1.071 4.78-3 6.744m0 0C7.7 14.066 6.012 15.195 4 16m5-3.256C7.887 11.61 7.06 10.335 6.559 9M9 12.744c1 1.018 2.23 1.92 3.662 2.65"
      />
    </Svg>
  )
}
