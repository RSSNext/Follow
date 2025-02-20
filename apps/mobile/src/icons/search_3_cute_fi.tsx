import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Search3CuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const Search3CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Search3CuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M2 10.5a8.5 8.5 0 1 1 15.176 5.262l3.652 3.652a1 1 0 0 1-1.414 1.414l-3.652-3.652A8.5 8.5 0 0 1 2 10.5M10.5 6a1 1 0 0 0 0 2 2.5 2.5 0 0 1 2.5 2.5 1 1 0 1 0 2 0A4.5 4.5 0 0 0 10.5 6"
        clipRule="evenodd"
      />
    </Svg>
  )
}
