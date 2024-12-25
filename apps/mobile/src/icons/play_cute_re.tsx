import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface PlayCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const PlayCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: PlayCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeWidth={2}
        d="M5.334 10.424c.062-3.213.093-4.82 1.56-5.667 1.467-.847 2.874-.07 5.69 1.484a81.402 81.402 0 0 1 2.725 1.574c2.746 1.657 4.119 2.485 4.118 4.18 0 1.693-1.373 2.52-4.119 4.176a84.049 84.049 0 0 1-2.746 1.585c-2.8 1.546-4.2 2.32-5.667 1.473-1.467-.846-1.498-2.445-1.56-5.642a81.662 81.662 0 0 1 0-3.163Z"
      />
    </Svg>
  )
}
