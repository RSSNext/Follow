import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface TrophyCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const TrophyCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: TrophyCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M14.946 3.001A4 4 0 0 1 18.725 6h.893a2.133 2.133 0 0 1 2.092 2.552l-.337 1.683a3.44 3.44 0 0 1-2.92 2.735A7.183 7.183 0 0 1 13 16.931V19h3a1 1 0 0 1 0 2H8a1 1 0 1 1 0-2h3V16.93a7.183 7.183 0 0 1-5.454-3.96 3.44 3.44 0 0 1-2.919-2.736l-.336-1.683A2.133 2.133 0 0 1 4.383 6h.892a4 4 0 0 1 3.779-2.999c1.96-.046 3.932-.046 5.892 0M4.992 8c-.134 0-.794-.11-.74.16.14.704.147 1.659.591 2.258-.066-.815.049-1.613.15-2.418m14.165 2.418c.444-.6.45-1.554.591-2.259.054-.27-.605-.16-.74-.16.1.806.216 1.604.149 2.419"
        clipRule="evenodd"
      />
    </Svg>
  )
}
