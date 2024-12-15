import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface FullscreenExitCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const FullscreenExitCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: FullscreenExitCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M8 3.5V4a4 4 0 0 1-4 4h-.5m17 0H20a4 4 0 0 1-4-4v-.5m0 17V20a4 4 0 0 1 4-4h.5m-17 0H4a4 4 0 0 1 4 4v.5"
      />
    </Svg>
  )
}
