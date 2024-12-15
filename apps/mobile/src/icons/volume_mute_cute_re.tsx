import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface VolumeMuteCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const VolumeMuteCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: VolumeMuteCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16.879 9.879 19 12m0 0 2.121 2.121M19 12.002l-2.121 2.12M19 12.002l2.121-2.122M6.995 16.296 9.498 18.3c1.807 1.445 2.71 2.168 3.537 1.812.826-.355.92-1.468 1.11-3.694.253-2.991.253-5.843 0-8.834-.19-2.226-.284-3.34-1.11-3.694-.827-.355-1.73.367-3.537 1.813L6.995 7.704a3.634 3.634 0 0 1-2.27.796v0A2.725 2.725 0 0 0 2 11.225v1.55A2.725 2.725 0 0 0 4.725 15.5v0c.825 0 1.626.28 2.27.796"
      />
    </Svg>
  )
}
