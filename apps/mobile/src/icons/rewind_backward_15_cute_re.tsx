import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface RewindBackward15CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const RewindBackward15CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: RewindBackward15CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 11.997c.007 4.11 2.846 7.817 7.024 8.758A9 9 0 1 0 5.217 6.061c-.066.075-.194.02-.182-.08l.392-3.355c.013-.113.175-.12.197-.008l.379 1.884m9.76 3.998h-3a.5.5 0 0 0-.5.5v1.754c0 .371.399.627.756.525.294-.084.644-.154.994-.154 1.313 0 2.188.98 2.188 2.188a2.187 2.187 0 0 1-4.193.874M7.5 9.5l1.5-1v7"
      />
    </Svg>
  )
}
