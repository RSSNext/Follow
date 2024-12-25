import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface TrophyCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const TrophyCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: TrophyCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M8 20h8M6 7H4.382c-.715 0-1.251.654-1.11 1.356l.336 1.683A2.44 2.44 0 0 0 6 12v0m12-5h1.617c.716 0 1.252.654 1.112 1.356l-.337 1.683A2.44 2.44 0 0 1 18 12v0m-6 4v4m5.84-13.286.292 2.34C18.592 12.742 15.717 16 12 16v0c-3.717 0-6.593-3.258-6.132-6.946l.293-2.34.02-.156A3 3 0 0 1 9.077 4L9.235 4H14.923a3 3 0 0 1 2.896 2.558z"
      />
    </Svg>
  )
}
