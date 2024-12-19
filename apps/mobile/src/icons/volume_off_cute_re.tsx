import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface VolumeOffCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const VolumeOffCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: VolumeOffCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 9.763c.614.55 1 1.347 1 2.236 0 .888-.386 1.687-1 2.236m2-6.708a5.985 5.985 0 0 1 2 4.472 5.985 5.985 0 0 1-2 4.472M4 8.597a2.727 2.727 0 0 0-2 2.628v1.55A2.725 2.725 0 0 0 4.725 15.5c.825 0 1.626.28 2.27.796l2.503 2.002c1.807 1.446 2.71 2.168 3.537 1.813.405-.174.634-.53.785-1.111m.475-5c.084-2.137.034-4.24-.15-6.417-.19-2.226-.284-3.34-1.11-3.695-.827-.355-1.73.368-3.537 1.813L7.5 7.3M4.222 4.223l15.556 15.556"
      />
    </Svg>
  )
}
