import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface User4CuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const User4CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: User4CuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M8.5 9.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0m9.758 7.484A7.985 7.985 0 0 1 12 20a7.985 7.985 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984"
        clipRule="evenodd"
      />
    </Svg>
  )
}
