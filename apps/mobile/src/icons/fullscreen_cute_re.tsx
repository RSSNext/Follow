import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface FullscreenCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const FullscreenCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: FullscreenCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M3.5 8v-.5a4 4 0 0 1 4-4H8M3.5 16v.5a4 4 0 0 0 4 4H8M20.5 8v-.5a4 4 0 0 0-4-4H16M20.5 16v.5a4 4 0 0 1-4 4H16"
      />
    </Svg>
  )
}
