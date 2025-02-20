import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface BlackBoard2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const BlackBoard2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: BlackBoard2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h6m-6 4h2M8 7.5l1.172-1.172c1.333-1.333 2-2 2.828-2 .828 0 1.495.667 2.828 2L16 7.5m-6 13h4c2.335 0 3.502 0 4.386-.472a4 4 0 0 0 1.642-1.642c.472-.884.472-2.051.472-4.386v0c0-2.335 0-3.502-.472-4.386a4 4 0 0 0-1.642-1.642C17.502 7.5 16.335 7.5 14 7.5h-4c-2.335 0-3.502 0-4.386.472a4 4 0 0 0-1.642 1.642C3.5 10.498 3.5 11.665 3.5 14v0c0 2.335 0 3.502.472 4.386a4 4 0 0 0 1.642 1.642c.884.472 2.051.472 4.386.472"
      />
    </Svg>
  )
}
