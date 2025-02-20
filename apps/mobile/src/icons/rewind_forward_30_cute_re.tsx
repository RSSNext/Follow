import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface RewindForward30CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const RewindForward30CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: RewindForward30CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m7.214 9.51.012-.028A1.611 1.611 0 0 1 8.71 8.5h.07c.95 0 1.72.77 1.72 1.72v0c0 .46-.183.9-.509 1.222l-.106.105c-.292.29-.687.453-1.1.453v0m-1.57 2.428.011.027c.253.596.837.982 1.484.982h.094c.937 0 1.696-.759 1.696-1.696v0c0-.472-.197-.923-.544-1.245l-.228-.21A1.072 1.072 0 0 0 9 12v0m12-.003c-.007 4.11-2.845 7.817-7.024 8.758a9 9 0 1 1 4.807-14.694c.066.075.194.02.183-.08l-.393-3.355c-.013-.113-.175-.12-.197-.008l-.379 1.884M15 15.5a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 15 8.5v0a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.5 1.5"
      />
    </Svg>
  )
}
