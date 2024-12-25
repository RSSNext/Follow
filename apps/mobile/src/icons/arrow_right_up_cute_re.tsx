import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface ArrowRightUpCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const ArrowRightUpCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: ArrowRightUpCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16.946 7.054 6.339 17.661M9.409 6.59a15.963 15.963 0 0 1 6.796-.249c.571.1.857.149 1.08.373.225.224.274.51.374 1.08a15.963 15.963 0 0 1-.25 6.796"
      />
    </Svg>
  )
}
