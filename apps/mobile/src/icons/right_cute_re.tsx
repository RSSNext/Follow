import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface RightCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const RightCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: RightCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.343 17.657a15.965 15.965 0 0 0 4.981-4.63c.334-.473.5-.71.5-1.027 0-.317-.166-.554-.5-1.028a15.962 15.962 0 0 0-4.98-4.629"
      />
    </Svg>
  )
}
