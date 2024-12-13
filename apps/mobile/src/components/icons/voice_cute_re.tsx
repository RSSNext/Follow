import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface VoiceCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const VoiceCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: VoiceCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M4 10v4m4-7v10m4-13v16m4-13v10m4-7v4"
      />
    </Svg>
  )
}
