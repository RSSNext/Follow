import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface ListCheck2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const ListCheck2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: ListCheck2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5h9m-9 7h9m-9 7h9M7.945 3.72c-.941.725-1.754 1.53-2.475 2.475A4.225 4.225 0 0 0 4.056 4.78m0 7c.592.373 1.05.818 1.414 1.415a13.22 13.22 0 0 1 2.475-2.475m-3.89 8.06c.593.373 1.051.817 1.415 1.415a13.22 13.22 0 0 1 2.475-2.475"
      />
    </Svg>
  )
}
